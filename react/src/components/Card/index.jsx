import React from 'react';

const Card = ({ title, description, children, footer, className = '' }) => {
  return (
    <section className={`card ${className}`.trim()} data-easytag="id4-src/components/Card/index.jsx">
      {(title || description) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </section>
  );
};

export default Card;
