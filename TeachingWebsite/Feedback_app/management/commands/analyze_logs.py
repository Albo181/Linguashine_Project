from django.core.management.base import BaseCommand
import re
from datetime import datetime, timedelta
import os

class Command(BaseCommand):
    help = 'Analyze application logs for errors and usage patterns'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=1,
            help='Number of days of logs to analyze'
        )
        parser.add_argument(
            '--level',
            type=str,
            default='WARNING',
            choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
            help='Minimum log level to analyze'
        )

    def handle(self, *args, **options):
        log_file = 'logs/debug.log'
        if not os.path.exists(log_file):
            self.stdout.write(self.style.ERROR(f'Log file not found: {log_file}'))
            return

        days = options['days']
        min_level = options['level']
        cutoff_date = datetime.now() - timedelta(days=days)

        # Log level hierarchy for filtering
        level_hierarchy = {
            'DEBUG': 0,
            'INFO': 1,
            'WARNING': 2,
            'ERROR': 3,
            'CRITICAL': 4
        }
        min_level_value = level_hierarchy[min_level]

        # Statistics
        stats = {
            'total_entries': 0,
            'errors': 0,
            'warnings': 0,
            'teacher_uploads': 0,
            'student_uploads': 0,
            'failed_uploads': 0,
            'invalid_files': 0
        }

        self.stdout.write(f'Analyzing logs from the past {days} days (minimum level: {min_level})')

        with open(log_file, 'r') as f:
            for line in f:
                try:
                    # Parse log entry
                    match = re.match(r'(\w+) (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}).*', line)
                    if not match:
                        continue

                    level, timestamp_str = match.groups()
                    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S,%f')

                    # Skip if entry is too old or below minimum level
                    if timestamp < cutoff_date or level_hierarchy[level] < min_level_value:
                        continue

                    stats['total_entries'] += 1

                    # Analyze entry content
                    if 'ERROR' in line:
                        stats['errors'] += 1
                        self.stdout.write(self.style.ERROR(f'Error found: {line.strip()}'))
                    elif 'WARNING' in line:
                        stats['warnings'] += 1

                    if 'Teacher upload attempt' in line:
                        stats['teacher_uploads'] += 1
                    elif 'Student upload attempt' in line:
                        stats['student_uploads'] += 1
                    
                    if 'Invalid file type attempted' in line:
                        stats['invalid_files'] += 1
                    elif 'Serializer validation failed' in line:
                        stats['failed_uploads'] += 1

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error parsing log line: {str(e)}'))
                    continue

        # Print summary
        self.stdout.write('\nLog Analysis Summary:')
        self.stdout.write('-' * 50)
        self.stdout.write(f'Total log entries analyzed: {stats["total_entries"]}')
        self.stdout.write(f'Total errors: {stats["errors"]}')
        self.stdout.write(f'Total warnings: {stats["warnings"]}')
        self.stdout.write(f'Teacher uploads: {stats["teacher_uploads"]}')
        self.stdout.write(f'Student uploads: {stats["student_uploads"]}')
        self.stdout.write(f'Failed uploads: {stats["failed_uploads"]}')
        self.stdout.write(f'Invalid file attempts: {stats["invalid_files"]}')

        # Calculate success rates
        total_uploads = stats['teacher_uploads'] + stats['student_uploads']
        if total_uploads > 0:
            success_rate = ((total_uploads - stats['failed_uploads']) / total_uploads) * 100
            self.stdout.write(f'Upload success rate: {success_rate:.1f}%')
