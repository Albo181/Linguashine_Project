 
import exam from '../images/exam.png';
import enjoyment from '../images/enjoyment.png';
import dashboard from '../images/dashboard.png';
import podcast from '../images/podcast.png';
import professional from '../images/professional.png';
import me1 from '../images/me1.png';
import mebbs1 from '../images/mebbs1.png';
import vrVideo from '../videos/VR_final (comp).mp4';
import blog_front from '../images/blog_front.png';
import best from '../images/best.png';
import duo from '../images/duo.jpg';
import samurai from '../images/samurai.png';

const getBlogData = (t) => [
    {
      id: 1,
      title: t('blog.posts.1.title'),
      image: me1,
      content: t('blog.posts.1.content')
    },
    {
        id: 2,
        title: t('blog.posts.2.title'),
        image: best,
        content: t('blog.posts.2.content')
    },
    {
      id: 3,
      title: t('blog.posts.3.title'),
      image: blog_front,
      video: vrVideo,
      videoCaption: t('blog.posts.3.videoCaption'),
      content: t('blog.posts.3.content')
    },
    {
      id: 4,
      title: t('blog.posts.4.title'),
      image: duo,
      content: t('blog.posts.4.content')
    },
    {
      id: 5,
      title: t('blog.posts.5.title'),
      image: samurai,
      content: t('blog.posts.5.content')
    },
  ];
  
  export default getBlogData;
