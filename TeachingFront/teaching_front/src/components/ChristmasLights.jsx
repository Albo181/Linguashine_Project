import React from 'react';

const ChristmasLights = () => {
  return (
    <div className="lights-container" style={{
      position: 'absolute',
      bottom: '-32px',
      left: 0,
      width: '100%',
      height: '40px',
      zIndex: 10,
      overflow: 'hidden'
    }}>
      <div className="lights" style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        {[...Array(20)].map((_, index) => (
          <div key={index} className={`light light-${index % 4}`} style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            margin: '0 15px',
            animation: `glow-${index % 4} 1.4s infinite alternate`,
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.5)'
          }} />
        ))}
      </div>
      <style jsx="true">{`
        @keyframes glow-0 {
          from { background-color: #ff0000; box-shadow: 0 0 10px 2px #ff0000; }
          to { background-color: #ff6666; box-shadow: 0 0 20px 5px #ff0000; }
        }
        @keyframes glow-1 {
          from { background-color: #00ff00; box-shadow: 0 0 10px 2px #00ff00; }
          to { background-color: #66ff66; box-shadow: 0 0 20px 5px #00ff00; }
        }
        @keyframes glow-2 {
          from { background-color: #0000ff; box-shadow: 0 0 10px 2px #0000ff; }
          to { background-color: #6666ff; box-shadow: 0 0 20px 5px #0000ff; }
        }
        @keyframes glow-3 {
          from { background-color: #ffff00; box-shadow: 0 0 10px 2px #ffff00; }
          to { background-color: #ffff66; box-shadow: 0 0 20px 5px #ffff00; }
        }
        .lights-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2c3e50;
          z-index: 1;
        }
        .light {
          position: relative;
        }
        .light::before {
          content: '';
          position: absolute;
          top: -15px;
          left: 50%;
          width: 2px;
          height: 15px;
          background: #2c3e50;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

export default ChristmasLights;
