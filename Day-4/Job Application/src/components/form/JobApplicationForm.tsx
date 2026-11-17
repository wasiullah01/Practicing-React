import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import styles from './JobApplicationForm.module.css';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { FormField } from '../ui/FormField';
import type {
  JobApplication,
  JobApplicationFormData,
  FormErrors,
  JobPosition,
  WorkArrangement,
  ExperienceType,
} from '../../types/jobApplication';
import {
  AVAILABLE_POSITIONS,
  NOTICE_PERIODS,
  RELOCATION_TIMELINES,
} from '../../data/initialApplications';

interface JobApplicationFormProps {
  onSubmitApplication: (application: JobApplication) => void;
}

const INITIAL_FORM_STATE: JobApplicationFormData = {
  fullName: '',
  email: '',
  phone: '',
  portfolioUrl: '',
  position: '',
  workArrangement: 'Remote',

  // Conditional: Experience
  experienceType: 'experienced',
  yearsOfExperience: '3',
  currentCompany: '',
  currentJobTitle: '',
  noticePeriod: '1 Month',
  university: '',
  major: '',
  graduationYear: '2026',
  gpa: '',
  capstoneProjectUrl: '',

  // Conditional: Work Arrangement
  timezone: 'UTC-5 (EST)',
  hasHomeOffice: true,
  willingToRelocate: false,
  relocationTimeline: 'Within 2-4 Weeks',

  // Conditional: Visa Sponsorship
  requiresSponsorship: false,
  visaType: 'F-1 OPT',
  visaExpiration: '',

  // Agreement
  agreeToPrivacy: false,
};

const AVATAR_COLORS = [
  '#0d9488', '#0284c7', '#6366f1', '#ec4899', '#f59e0b', '#8b5cf6', '#10b981',
];

export function JobApplicationForm({ onSubmitApplication }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<JobApplicationFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Uncontrolled refs for file and textarea
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterRef = useRef<HTMLTextAreaElement>(null);
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof JobApplicationFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof JobApplicationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Field validation with dynamic conditional logic
  const validateField = (field: keyof JobApplicationFormData, value: unknown): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Full legal name is required.';
        }
        if (value.trim().length < 3) {
          return 'Full name must be at least 3 characters.';
        }
        return undefined;

      case 'email':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Email address is required.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        return undefined;

      case 'phone':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Phone number is required.';
        }
        if (value.replace(/\D/g, '').length < 10) {
          return 'Phone number must have at least 10 digits.';
        }
        return undefined;

      case 'position':
        if (!value) {
          return 'Please select the position you are applying for.';
        }
        return undefined;

      // Conditional validation: Experienced
      case 'currentCompany':
        if (formData.experienceType === 'experienced') {
          if (!value || typeof value !== 'string' || value.trim().length === 0) {
            return 'Please provide your current or most recent employer.';
          }
        }
        return undefined;

      case 'currentJobTitle':
        if (formData.experienceType === 'experienced') {
          if (!value || typeof value !== 'string' || value.trim().length === 0) {
            return 'Please provide your current or most recent job title.';
          }
        }
        return undefined;

      // Conditional validation: Fresh Graduate
      case 'university':
        if (formData.experienceType === 'fresh-grad') {
          if (!value || typeof value !== 'string' || value.trim().length === 0) {
            return 'Institution / university name is required.';
          }
        }
        return undefined;

      case 'major':
        if (formData.experienceType === 'fresh-grad') {
          if (!value || typeof value !== 'string' || value.trim().length === 0) {
            return 'Field of study or major is required.';
          }
        }
        return undefined;

      // Conditional validation: Visa Expiration
      case 'visaExpiration':
        if (formData.requiresSponsorship) {
          if (!value || typeof value !== 'string') {
            return 'Please specify your current visa expiration date.';
          }
        }
        return undefined;

      case 'agreeToPrivacy':
        if (!value) {
          return 'You must accept the applicant declaration to continue.';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};

    (Object.keys(formData) as Array<keyof JobApplicationFormData>).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    const coverLetterText = coverLetterRef.current ? coverLetterRef.current.value.trim() : '';
    const uploadedFile = resumeInputRef.current?.files?.[0];
    const resumeName = uploadedFile ? uploadedFile.name : 'Candidate_Resume.pdf';

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const generatedId = `APP-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newApplication: JobApplication = {
      id: generatedId,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      portfolioUrl: formData.portfolioUrl.trim() || 'https://github.com',
      position: formData.position as JobPosition,
      workArrangement: formData.workArrangement,
      status: 'Under Review',
      appliedDate: new Date().toISOString().split('T')[0],
      avatarColor: randomColor,
      experienceType: formData.experienceType,

      experiencedDetails:
        formData.experienceType === 'experienced'
          ? {
              yearsOfExperience: Number(formData.yearsOfExperience) || 1,
              currentCompany: formData.currentCompany.trim(),
              currentJobTitle: formData.currentJobTitle.trim(),
              noticePeriod: formData.noticePeriod,
            }
          : undefined,

      freshGradDetails:
        formData.experienceType === 'fresh-grad'
          ? {
              university: formData.university.trim(),
              major: formData.major.trim(),
              graduationYear: Number(formData.graduationYear) || 2026,
              gpa: formData.gpa.trim() || 'N/A',
              capstoneProjectUrl: formData.capstoneProjectUrl.trim() || 'https://github.com',
            }
          : undefined,

      remoteDetails:
        formData.workArrangement === 'Remote'
          ? {
              timezone: formData.timezone,
              hasHomeOffice: formData.hasHomeOffice,
            }
          : undefined,

      onsiteDetails:
        formData.workArrangement !== 'Remote'
          ? {
              willingToRelocate: formData.willingToRelocate,
              relocationTimeline: formData.relocationTimeline,
            }
          : undefined,

      visaDetails: {
        requiresSponsorship: formData.requiresSponsorship,
        visaType: formData.requiresSponsorship ? formData.visaType : undefined,
        visaExpiration: formData.requiresSponsorship ? formData.visaExpiration : undefined,
      },

      coverLetterNotes: coverLetterText || 'No custom cover letter provided.',
      resumeFileName: resumeName,
    };

    onSubmitApplication(newApplication);

    // Reset Form
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    if (coverLetterRef.current) coverLetterRef.current.value = '';
    if (resumeInputRef.current) resumeInputRef.current.value = '';

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
    fullNameInputRef.current?.focus();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    if (coverLetterRef.current) coverLetterRef.current.value = '';
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  return (
    <Card variant="elevated">
      <CardHeader
        title="Candidate Application Form"
        subtitle="Complete the submission details below to enter our active recruitment pipeline."
      />

      <CardBody>
        {showSuccessToast && (
          <div className={styles.successBanner} role="status">
            <span>🎉 <strong>Application Received!</strong> Profile has been successfully registered.</span>
            <button
              type="button"
              onClick={() => setShowSuccessToast(false)}
              className="text-emerald-800 text-sm font-bold hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Candidate Full Name */}
          <FormField
            id="fullName"
            label="Full Legal Name"
            required
            error={touched.fullName ? errors.fullName : undefined}
          >
            <input
              ref={fullNameInputRef}
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              placeholder="e.g. Jordan Miller"
              className={`${styles.input} ${
                touched.fullName && errors.fullName ? styles.inputError : ''
              }`}
            />
          </FormField>

          {/* Email & Phone Grid */}
          <div className={styles.grid2}>
            <FormField
              id="email"
              label="Email Address"
              required
              error={touched.email ? errors.email : undefined}
            >
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="name@example.com"
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.inputError : ''
                }`}
              />
            </FormField>

            <FormField
              id="phone"
              label="Phone Number"
              required
              error={touched.phone ? errors.phone : undefined}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="+1 (555) 000-0000"
                className={`${styles.input} ${
                  touched.phone && errors.phone ? styles.inputError : ''
                }`}
              />
            </FormField>
          </div>

          {/* Position & Work Arrangement Grid */}
          <div className={styles.grid2}>
            <FormField
              id="position"
              label="Target Role / Position"
              required
              error={touched.position ? errors.position : undefined}
            >
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                onBlur={() => handleBlur('position')}
                className={`${styles.select} ${
                  touched.position && errors.position ? styles.selectError : ''
                }`}
              >
                <option value="">-- Select Target Position --</option>
                {AVAILABLE_POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="workArrangement"
              label="Preferred Work Arrangement"
              required
              helperText="Determines location and scheduling logistics"
            >
              <select
                id="workArrangement"
                name="workArrangement"
                value={formData.workArrangement}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Remote">Remote (Global)</option>
                <option value="Hybrid">Hybrid (2-3 Days Office)</option>
                <option value="On-site">On-site (Headquarters)</option>
              </select>
            </FormField>
          </div>

          {/* Professional Experience Toggle */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Career Experience Level <span className="text-rose-500">*</span>
            </label>
            <div className={styles.experienceToggleGroup}>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, experienceType: 'experienced' }))
                }
                className={`${styles.experienceToggleBtn} ${
                  formData.experienceType === 'experienced'
                    ? styles.experienceToggleBtnActive
                    : ''
                }`}
              >
                <span className={styles.toggleIcon}>💼</span>
                <div>
                  <div className={styles.toggleTitle}>Experienced Candidate</div>
                  <div className={styles.toggleDesc}>Prior industry employment history</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, experienceType: 'fresh-grad' }))
                }
                className={`${styles.experienceToggleBtn} ${
                  formData.experienceType === 'fresh-grad'
                    ? styles.experienceToggleBtnActive
                    : ''
                }`}
              >
                <span className={styles.toggleIcon}>🎓</span>
                <div>
                  <div className={styles.toggleTitle}>Early Career / Graduate</div>
                  <div className={styles.toggleDesc}>Entry-level or university graduate</div>
                </div>
              </button>
            </div>
          </div>

          {/* CONDITIONAL SECTION A: Experienced Candidate Fields */}
          {formData.experienceType === 'experienced' && (
            <div className={styles.conditionalCard}>
              <div className={styles.conditionalHeader}>
                <span className={styles.conditionalTitle}>
                  <span>🏢</span> Professional Employment Record
                </span>
                <span className={styles.conditionalSubtitle}>
                  Tenure and current position details
                </span>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="yearsOfExperience"
                  label="Years of Relevant Experience"
                  required
                >
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="1"
                    max="40"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </FormField>

                <FormField
                  id="noticePeriod"
                  label="Notice Period / Availability"
                  required
                >
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {NOTICE_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="currentCompany"
                  label="Current / Most Recent Company"
                  required
                  error={touched.currentCompany ? errors.currentCompany : undefined}
                >
                  <input
                    id="currentCompany"
                    name="currentCompany"
                    type="text"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    onBlur={() => handleBlur('currentCompany')}
                    placeholder="e.g. Acme Cloud Corp"
                    className={`${styles.input} ${
                      touched.currentCompany && errors.currentCompany ? styles.inputError : ''
                    }`}
                  />
                </FormField>

                <FormField
                  id="currentJobTitle"
                  label="Current / Most Recent Job Title"
                  required
                  error={touched.currentJobTitle ? errors.currentJobTitle : undefined}
                >
                  <input
                    id="currentJobTitle"
                    name="currentJobTitle"
                    type="text"
                    value={formData.currentJobTitle}
                    onChange={handleChange}
                    onBlur={() => handleBlur('currentJobTitle')}
                    placeholder="e.g. Senior Software Engineer"
                    className={`${styles.input} ${
                      touched.currentJobTitle && errors.currentJobTitle ? styles.inputError : ''
                    }`}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* CONDITIONAL SECTION B: Fresh Graduate Fields */}
          {formData.experienceType === 'fresh-grad' && (
            <div className={styles.conditionalCard}>
              <div className={styles.conditionalHeader}>
                <span className={styles.conditionalTitle}>
                  <span>🎓</span> Academic &amp; Educational Background
                </span>
                <span className={styles.conditionalSubtitle}>
                  Higher education and capstone details
                </span>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="university"
                  label="University / Institution"
                  required
                  error={touched.university ? errors.university : undefined}
                >
                  <input
                    id="university"
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    onBlur={() => handleBlur('university')}
                    placeholder="e.g. University of California"
                    className={`${styles.input} ${
                      touched.university && errors.university ? styles.inputError : ''
                    }`}
                  />
                </FormField>

                <FormField
                  id="major"
                  label="Degree &amp; Major Field"
                  required
                  error={touched.major ? errors.major : undefined}
                >
                  <input
                    id="major"
                    name="major"
                    type="text"
                    value={formData.major}
                    onChange={handleChange}
                    onBlur={() => handleBlur('major')}
                    placeholder="e.g. BS Computer Science"
                    className={`${styles.input} ${
                      touched.major && errors.major ? styles.inputError : ''
                    }`}
                  />
                </FormField>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="gpa"
                  label="Cumulative GPA / Academic Standing"
                  helperText="Optional academic metric"
                >
                  <input
                    id="gpa"
                    name="gpa"
                    type="text"
                    value={formData.gpa}
                    onChange={handleChange}
                    placeholder="e.g. 3.8 / 4.0"
                    className={styles.input}
                  />
                </FormField>

                <FormField
                  id="capstoneProjectUrl"
                  label="Capstone / Academic Project URL"
                  helperText="Public repository or live portfolio demonstration"
                >
                  <input
                    id="capstoneProjectUrl"
                    name="capstoneProjectUrl"
                    type="url"
                    value={formData.capstoneProjectUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/project"
                    className={styles.input}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* CONDITIONAL SECTION 2: Work Arrangement Logistics */}
          {formData.workArrangement === 'Remote' ? (
            <div className={styles.conditionalCard}>
              <div className={styles.conditionalHeader}>
                <span className={styles.conditionalTitle}>
                  <span>🌐</span> Remote Work Logistics
                </span>
                <span className={styles.conditionalSubtitle}>
                  Timezone alignment &amp; remote environment
                </span>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="timezone"
                  label="Operating Timezone"
                  required
                >
                  <input
                    id="timezone"
                    name="timezone"
                    type="text"
                    value={formData.timezone}
                    onChange={handleChange}
                    placeholder="e.g. UTC-5 (EST) or UTC+0 (GMT)"
                    className={styles.input}
                  />
                </FormField>

                <div className="flex flex-col justify-center pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      name="hasHomeOffice"
                      type="checkbox"
                      checked={formData.hasHomeOffice}
                      onChange={handleChange}
                      className={styles.checkboxInput}
                    />
                    <span>Equipped with a quiet workspace and high-speed internet.</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.conditionalCard}>
              <div className={styles.conditionalHeader}>
                <span className={styles.conditionalTitle}>
                  <span>🏢</span> Relocation &amp; On-site Availability
                </span>
                <span className={styles.conditionalSubtitle}>
                  Office attendance readiness
                </span>
              </div>

              <div className={styles.grid2}>
                <FormField
                  id="relocationTimeline"
                  label="Relocation Availability"
                >
                  <select
                    id="relocationTimeline"
                    name="relocationTimeline"
                    value={formData.relocationTimeline}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {RELOCATION_TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="flex flex-col justify-center pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      name="willingToRelocate"
                      type="checkbox"
                      checked={formData.willingToRelocate}
                      onChange={handleChange}
                      className={styles.checkboxInput}
                    />
                    <span>Willing to relocate if relocation assistance is provided.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL SECTION 3: Visa Sponsorship */}
          <div className={styles.checkboxCard}>
            <div className={styles.checkboxRow}>
              <input
                id="requiresSponsorship"
                name="requiresSponsorship"
                type="checkbox"
                checked={formData.requiresSponsorship}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <label htmlFor="requiresSponsorship" className={styles.checkboxLabel}>
                Will you now or in the future require employment visa sponsorship to work legally?
              </label>
            </div>

            {formData.requiresSponsorship && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  id="visaType"
                  label="Current Work Authorization / Visa Status"
                  required
                >
                  <input
                    id="visaType"
                    name="visaType"
                    type="text"
                    value={formData.visaType}
                    onChange={handleChange}
                    placeholder="e.g. F-1 OPT / H-1B Transfer / Other"
                    className={styles.input}
                  />
                </FormField>

                <FormField
                  id="visaExpiration"
                  label="Current Status Expiration Date"
                  required
                  error={touched.visaExpiration ? errors.visaExpiration : undefined}
                >
                  <input
                    id="visaExpiration"
                    name="visaExpiration"
                    type="date"
                    value={formData.visaExpiration}
                    onChange={handleChange}
                    onBlur={() => handleBlur('visaExpiration')}
                    className={`${styles.input} ${
                      touched.visaExpiration && errors.visaExpiration ? styles.inputError : ''
                    }`}
                  />
                </FormField>
              </div>
            )}
          </div>

          {/* Portfolio Link */}
          <FormField
            id="portfolioUrl"
            label="Portfolio, GitHub, or LinkedIn Profile"
            helperText="Public showcase of your technical work and design projects"
          >
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={handleChange}
              placeholder="https://github.com/your-username"
              className={styles.input}
            />
          </FormField>

          {/* Supporting Documents Section */}
          <div className="mt-2 mb-2">
            <div className={styles.sectionDivider}>
              <h4 className={styles.sectionHeading}>Supporting Documents</h4>
            </div>

            <FormField
              id="resume"
              label="Curriculum Vitae / Resume"
              helperText="Accepted formats: PDF, DOCX up to 10MB"
            >
              <input
                ref={resumeInputRef}
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className={styles.input}
                style={{ paddingTop: '0.45rem' }}
              />
            </FormField>

            <FormField
              id="coverLetter"
              label="Cover Note / Motivation Statement"
              helperText="Brief summary of your background, achievements, and motivation for this role"
            >
              <textarea
                ref={coverLetterRef}
                id="coverLetter"
                rows={3}
                placeholder="Share key highlights about your experience or why you are excited to join..."
                defaultValue=""
                className={styles.textarea}
              />
            </FormField>
          </div>

          {/* Privacy Agreement */}
          <div className={styles.checkboxRow} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              id="agreeToPrivacy"
              name="agreeToPrivacy"
              type="checkbox"
              checked={formData.agreeToPrivacy}
              onChange={handleChange}
              className={styles.checkboxInput}
            />
            <label htmlFor="agreeToPrivacy" className={styles.checkboxLabel}>
              I certify that all supplied career credentials are accurate and consent to recruitment data processing according to the candidate privacy policy.
            </label>
          </div>
          {errors.agreeToPrivacy && (
            <p className={styles.errorMessage} style={{ marginBottom: '0.5rem' }} role="alert">
              ⚠️ {errors.agreeToPrivacy}
            </p>
          )}

          {/* Form Action Buttons */}
          <div className={styles.actionsRow}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              <span>Submit Application</span>
              <span>&rarr;</span>
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
