import React from 'react';
import WorkerCard from './WorkerCard';

function WorkerList({ workers, onDeleteWorker }) {
  if (workers.length === 0) {
    return <div className="no-workers">No workers found matching your criteria.</div>;
  }

  return (
    <div className="workers-grid">
      {workers.map(worker => (
        <WorkerCard 
          key={worker.id} 
          worker={worker} 
          onDelete={() => onDeleteWorker(worker.id)}
        />
      ))}
    </div>
  );
}

export default WorkerList;
