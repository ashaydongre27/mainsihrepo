import React, { useRef, useEffect } from 'react';

const SkillTree = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const updateSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        drawTree();
      }
    };
    
    // Mock skills data
    const skills = [
      { id: 0, name: 'Core Foundations', x: 0.5, y: 0.9, level: 5, maxLevel: 5, connections: [1, 2] },
      { id: 1, name: 'Python', x: 0.3, y: 0.7, level: 4, maxLevel: 5, connections: [3, 4] },
      { id: 2, name: 'Ayurvedic Pharmacognosy', x: 0.7, y: 0.7, level: 3, maxLevel: 5, connections: [5, 6] },
      { id: 3, name: 'Data Analysis', x: 0.2, y: 0.5, level: 3, maxLevel: 5, connections: [] },
      { id: 4, name: 'Machine Learning', x: 0.4, y: 0.5, level: 2, maxLevel: 5, connections: [7] },
      { id: 5, name: 'Herbal Formulation', x: 0.6, y: 0.5, level: 2, maxLevel: 5, connections: [8] },
      { id: 6, name: 'Clinical Research', x: 0.8, y: 0.5, level: 1, maxLevel: 5, connections: [] },
      { id: 7, name: 'NLP', x: 0.4, y: 0.3, level: 0, maxLevel: 5, connections: [] },
      { id: 8, name: 'Advanced Therapeutics', x: 0.6, y: 0.3, level: 0, maxLevel: 5, connections: [] },
      { id: 9, name: 'Communication', x: 0.1, y: 0.8, level: 4, maxLevel: 5, connections: [] },
      { id: 10, name: 'Teamwork', x: 0.9, y: 0.8, level: 5, maxLevel: 5, connections: [] },
    ];

    let hoverNode = null;

    const drawTree = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw connections
      ctx.lineWidth = 2;
      skills.forEach(skill => {
        skill.connections.forEach(targetId => {
          const target = skills.find(s => s.id === targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(skill.x * w, skill.y * h);
            ctx.lineTo(target.x * w, target.y * h);
            
            // Gradient line
            const grad = ctx.createLinearGradient(skill.x * w, skill.y * h, target.x * w, target.y * h);
            grad.addColorStop(0, skill.level > 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(75, 85, 99, 0.5)');
            grad.addColorStop(1, target.level > 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(75, 85, 99, 0.5)');
            
            ctx.strokeStyle = grad;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      skills.forEach(skill => {
        const isHovered = hoverNode === skill.id;
        const x = skill.x * w;
        const y = skill.y * h;
        const radius = isHovered ? 15 : 12;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (skill.level > 0) {
          ctx.fillStyle = '#8b5cf6'; // purple
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 15;
          ctx.fill();
        } else {
          ctx.fillStyle = '#374151'; // gray gap
          ctx.shadowBlur = 0;
          ctx.fill();
        }
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = skill.level > 0 ? '#ddd6fe' : '#4b5563';
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
        
        // Draw label
        ctx.font = '12px sans-serif';
        ctx.fillStyle = skill.level > 0 ? '#e5e7eb' : '#9ca3af';
        ctx.textAlign = 'center';
        ctx.fillText(skill.name, x, y + radius + 15);
        
        if (isHovered) {
          // Draw tooltip
          ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
          ctx.strokeStyle = '#8b5cf6';
          ctx.beginPath();
          ctx.roundRect(x - 60, y - 50, 120, 30, 5);
          ctx.fill();
          ctx.stroke();
          
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`Level ${skill.level}/${skill.maxLevel}`, x, y - 30);
        }
      });
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const w = canvas.width;
      const h = canvas.height;

      let found = null;
      for (const skill of skills) {
        const dx = (skill.x * w) - mouseX;
        const dy = (skill.y * h) - mouseY;
        if (dx * dx + dy * dy < 400) { // roughly 20px radius hit area
          found = skill.id;
          break;
        }
      }
      
      if (found !== hoverNode) {
        hoverNode = found;
        canvas.style.cursor = found !== null ? 'pointer' : 'default';
        drawTree();
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Skill Constellation</h2>
          <p className="text-gray-400 mt-1">Map your journey through the cosmos of knowledge.</p>
        </div>
        <div className="flex space-x-4 text-sm">
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-purple-500 mr-2 shadow-[0_0_8px_#a855f7]"></span> Acquired</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-600 mr-2"></span> Unlocked Gap</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 bg-gray-900/40 rounded-xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};

export default SkillTree;
