import { JobApplication, STATUS_CONFIG } from '../types';
import { MapPin, DollarSign, ExternalLink, Calendar, User, Mail, Edit, Trash2, StickyNote } from 'lucide-react';
import { useState } from 'react';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobApplication['status']) => void;
}

export default function ApplicationCard({ application, onEdit, onDelete, onStatusChange }: ApplicationCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const statusConfig = STATUS_CONFIG[application.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{application.position}</h3>
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-600 font-medium mt-0.5">{application.company}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(application)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-500">
        {application.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {application.location}
          </span>
        )}
        {application.salary && (
          <span className="inline-flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {application.salary}
          </span>
        )}
        {application.dateApplied && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(application.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        {application.contactName && (
          <span className="inline-flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {application.contactName}
          </span>
        )}
      </div>

      {/* Tags */}
      {application.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {application.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions Row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Listing
            </a>
          )}
          {application.contactEmail && (
            <a
              href={`mailto:${application.contactEmail}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          )}
          {application.notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <StickyNote className="w-3.5 h-3.5" />
              Notes
            </button>
          )}
        </div>

        {/* Quick Status Change */}
        <select
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as JobApplication['status'])}
          className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Notes Panel */}
      {showNotes && application.notes && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.notes}</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium">Delete this application?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onDelete(application.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-white text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
