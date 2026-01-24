import React from 'react';
import WorkerCard from './WorkerCard';

function WorkerList({ workers, onDeleteWorker, onEditWorker }) {
  if (workers.length === 0) {
    return <div className="no-workers">No workers found matching your criteria.</div>;
  }

  return (
    <div className="workers-grid">
      {workers.map(worker => {
        const workerId = worker._id || worker.id;
        return (
          <WorkerCard 
            key={workerId} 
            worker={worker} 
            onDelete={() => onDeleteWorker(workerId)}
            onEdit={onEditWorker}
          />
        );
      })}
    </div>
  );
}

export default WorkerList;
