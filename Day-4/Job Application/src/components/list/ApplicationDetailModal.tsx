import styles from './ApplicationDetailModal.module.css';
import { Modal } from '../ui/Modal';
import { Badge, type BadgeVariant } from '../ui/Badge';
import type { JobApplication, ApplicationStatus } from '../../types/jobApplication';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onToggleStatus: (id: string, currentStatus: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
}

export function ApplicationDetailModal({
  application,
  onClose,
  onToggleStatus,
  onDeleteApplication,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  const getStatusVariant = (status: ApplicationStatus): BadgeVariant => {
    switch (status) {
      case 'Offer Extended':
        return 'success';
      case 'Interviewing':
        return 'brand';
      case 'Under Review':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const initials = application.fullName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleAdvance = () => {
    onToggleStatus(application.id, application.status);
    onClose();
  };

  const handleDelete = () => {
    onDeleteApplication(application.id);
    onClose();
  };

  return (
    <Modal
      isOpen={!!application}
      onClose={onClose}
      title="Candidate Profile Dossier"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition"
          >
            Delete Application
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdvance}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Advance Pipeline ({application.status})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded hover:bg-teal-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      <div className={styles.detailModal}>
        <div className={styles.headerRow}>
          <div className={styles.avatar} style={{ backgroundColor: application.avatarColor }}>
            {initials}
          </div>
          <div className={styles.nameBlock}>
            <h3 className={styles.fullName}>{application.fullName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusVariant(application.status)} withDot>
                {application.status}
              </Badge>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                ID: {application.id}
              </span>
            </div>
          </div>
        </div>

        {/* General Info Grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Applied Position</span>
            <span className={styles.infoValue}>{application.position}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Work Arrangement</span>
            <span className={styles.infoValue}>{application.workArrangement}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email Address</span>
            <span className={styles.infoValue}>{application.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phone Number</span>
            <span className={styles.infoValue}>{application.phone}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Portfolio / Online Profile</span>
            <a
              href={application.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 underline font-medium truncate"
            >
              {application.portfolioUrl}
            </a>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Date Submitted</span>
            <span className={styles.infoValue}>{application.appliedDate}</span>
          </div>
        </div>

        {/* Candidate Credentials */}
        <div className={styles.credentialsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              Candidate Background
            </span>
            <span className="text-xs text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded">
              {application.experienceType === 'experienced' ? 'Industry Experienced' : 'Early Career'}
            </span>
          </div>

          {application.experienceType === 'experienced' && application.experiencedDetails ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Years of Experience:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.experiencedDetails.yearsOfExperience} Years</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Notice Period:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.experiencedDetails.noticePeriod}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Current Employer:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.experiencedDetails.currentCompany}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Current Position:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.experiencedDetails.currentJobTitle}</p>
              </div>
            </div>
          ) : application.freshGradDetails ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Institution:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.freshGradDetails.university}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Degree &amp; Major:</span>
                <p className="font-bold text-slate-800 mt-0.5">{application.freshGradDetails.major}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Class Year &amp; GPA:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  Class of {application.freshGradDetails.graduationYear} &bull; GPA: {application.freshGradDetails.gpa || 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Project / Capstone:</span>
                <a
                  href={application.freshGradDetails.capstoneProjectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-600 underline block truncate mt-0.5"
                >
                  {application.freshGradDetails.capstoneProjectUrl}
                </a>
              </div>
            </div>
          ) : null}

          {/* Location details */}
          {application.remoteDetails && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Remote Logistics:</span> Timezone {application.remoteDetails.timezone} &bull; {application.remoteDetails.hasHomeOffice ? 'Dedicated Home Office Confirmed' : 'No Dedicated Home Office'}
            </div>
          )}

          {application.onsiteDetails && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Relocation Availability:</span> {application.onsiteDetails.willingToRelocate ? 'Willing to relocate' : 'Not seeking relocation'} ({application.onsiteDetails.relocationTimeline})
            </div>
          )}

          {/* Visa details */}
          {application.visaDetails.requiresSponsorship && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-amber-900 font-medium">
              Work Authorization: Visa Sponsorship Requested &bull; Status: {application.visaDetails.visaType || 'Needs New Visa'}{' '}
              {application.visaDetails.visaExpiration && `(Valid through: ${application.visaDetails.visaExpiration})`}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className={styles.documentsBox}>
          <div className="flex items-center justify-between">
            <span className={styles.documentsTitle}>
              Attached Documents
            </span>
            <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              📎 {application.resumeFileName || 'Resume.pdf'}
            </span>
          </div>
          <p className={styles.notesContent}>
            &ldquo;{application.coverLetterNotes || 'No custom cover note provided.'}&rdquo;
          </p>
        </div>
      </div>
    </Modal>
  );
}
