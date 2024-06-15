import React from 'react';

const CauseList = ({ causes, onApprove, onReject }) => {
  return (
    <ul>
      {causes.map(cause => (
        <li key={cause.id}>
          {cause.title} - {cause.status}
          {cause.status === 'pending' && onApprove && onReject && (
            <>
              <button onClick={() => onApprove(cause.id)} className="btn btn-success mx-2">Approve</button>
              <button onClick={() => onReject(cause.id)} className="btn btn-danger mx-2">Reject</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CauseList;