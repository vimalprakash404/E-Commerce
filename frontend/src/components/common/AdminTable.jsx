import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const AdminTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  emptyMessage = "No data available"
}) => {
  if (loading) {
    return (
      <div className="admin-table-container">
        <div className="admin-loading">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-table-container">
        <div className="admin-loading">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              <td>
                <div className="action-buttons">
                  {onView && (
                    <button 
                      className="btn-icon"
                      onClick={() => onView(row)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {onEdit && (
                    <button 
                      className="btn-icon"
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="btn-icon delete"
                      onClick={() => onDelete(row)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;