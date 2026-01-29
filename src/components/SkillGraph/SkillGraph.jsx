import React, { useContext, useMemo, useRef, useEffect, useState } from 'react';
import  ForceGraph2D  from 'react-force-graph-2d';
import { ThemeContext } from '../../contexts/theme';
import { skills, skillConnections } from '../../portfolio';
import './SkillGraph.css';

const SkillGraph = () => {
  const [{ themeName }] = useContext(ThemeContext);
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const graphData = useMemo(() => {
    const nodes = skills.map((skill) => ({ id: skill }));
    
    const links = skillConnections
      .filter(([source, target]) => skills.includes(source) && skills.includes(target))
      .map(([source, target]) => ({ source, target }));

    return { nodes, links };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 500,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    node: themeName === 'dark' ? '#5da9e9' : '#2978b5',
    text: themeName === 'dark' ? '#bdbddd' : '#555',
    line: themeName === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <section className="section skill-graph" id="architecture">
      <h2 className="section__title">System Architecture</h2>
      <div className="skill-graph__container" ref={containerRef}>
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          linkColor={() => colors.line}
          linkWidth={1.5}
          nodeRelSize={7}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 15 / globalScale;
            ctx.font = `${fontSize}px Poppins, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = colors.text;
            ctx.fillText(label, node.x, node.y + 14);

            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = colors.node;
            ctx.shadowBlur = 10;
            ctx.shadowColor = colors.node;
            ctx.fill();
            ctx.shadowBlur = 0;
          }}
        />
      </div>
    </section>
  );
};

export default SkillGraph;