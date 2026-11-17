import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import styles from './StudentForm.module.css';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { FormField } from '../ui/FormField';
import type { Student, StudentFormData, FormErrors, Course, Gender } from '../../types/student';
import { AVAILABLE_COURSES, AVAILABLE_SEMESTERS } from '../../data/initialStudents';

interface StudentFormProps {
  onRegisterStudent: (newStudent: Student) => void;
}

const INITIAL_FORM_STATE: StudentFormData = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  course: '',
  semester: '1st Semester',
  agreeToTerms: false,
};

const AVATAR_COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4',
];

export function StudentForm({ onRegisterStudent }: StudentFormProps) {
  // 1. Controlled State: React manages input values and updates them via state
  const [formData, setFormData] = useState<StudentFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // 2. Uncontrolled Component: useRef directly references DOM elements
  // The DOM is the source of truth for these inputs, reading value only on submit
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // Controlled component input change handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error on user edit
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof StudentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof StudentFormData, value: unknown): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Full name is required.';
        }
        if (value.trim().length < 3) {
          return 'Full name must be at least 3 characters.';
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          return 'Full name can only contain letters, spaces, and hyphens.';
        }
        return undefined;

      case 'email':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Email address is required.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address (e.g. name@domain.com).';
        }
        return undefined;

      case 'phone':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Phone number is required.';
        }
        if (value.replace(/\D/g, '').length < 10) {
          return 'Phone number must contain at least 10 digits.';
        }
        return undefined;

      case 'dateOfBirth':
        if (!value || typeof value !== 'string') {
          return 'Date of birth is required.';
        }
        {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (dob > today) {
            return 'Date of birth cannot be in the future.';
          }
          if (age < 15) {
            return 'Student must be at least 15 years old to register.';
          }
        }
        return undefined;

      case 'gender':
        if (!value) {
          return 'Please select a gender.';
        }
        return undefined;

      case 'course':
        if (!value) {
          return 'Please select an academic course/degree.';
        }
        return undefined;

      case 'agreeToTerms':
        if (!value) {
          return 'You must accept the enrollment terms.';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};

    (Object.keys(formData) as Array<keyof StudentFormData>).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    // Read values from Uncontrolled Components via refs
    const uncontrolledNotes = notesRef.current ? notesRef.current.value.trim() : '';

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const generatedId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      id: generatedId,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as Gender,
      course: formData.course as Course,
      semester: formData.semester,
      status: 'Active',
      registeredAt: new Date().toISOString().split('T')[0],
      notes: uncontrolledNotes || 'No additional remarks provided.',
      avatarColor: randomColor,
    };

    // Lifting state up: Pass newly registered student to parent container
    onRegisterStudent(newStudent);

    // Reset controlled state
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});

    // Reset uncontrolled ref values
    if (notesRef.current) notesRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Show success banner & focus first field
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
    fullNameInputRef.current?.focus();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    if (notesRef.current) notesRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card variant="elevated">
      <CardHeader
        title="Student Registration Form"
        subtitle="Controlled inputs, Uncontrolled refs, real-time validation & state management"
      />

      <CardBody>
        {showSuccessToast && (
          <div className={styles.successBanner} role="status">
            <span>🎉 <strong>Success!</strong> Student registration submitted and added to the list.</span>
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
          {/* Controlled: Full Name */}
          <FormField
            id="fullName"
            label="Full Name"
            required
            componentType="controlled"
            error={touched.fullName ? errors.fullName : undefined}
            helperText="Legal first and last name"
          >
            <input
              ref={fullNameInputRef}
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              placeholder="e.g. Alexander Vance"
              className={`${styles.input} ${
                touched.fullName && errors.fullName ? styles.inputError : ''
              }`}
              aria-invalid={!!(touched.fullName && errors.fullName)}
            />
          </FormField>

          {/* Controlled: Email & Phone Grid */}
          <div className={styles.grid2}>
            <FormField
              id="email"
              label="Email Address"
              required
              componentType="controlled"
              error={touched.email ? errors.email : undefined}
            >
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="student@university.edu"
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.inputError : ''
                }`}
                aria-invalid={!!(touched.email && errors.email)}
              />
            </FormField>

            <FormField
              id="phone"
              label="Contact Phone"
              required
              componentType="controlled"
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
                aria-invalid={!!(touched.phone && errors.phone)}
              />
            </FormField>
          </div>

          {/* Controlled: Date of Birth & Semester */}
          <div className={styles.grid2}>
            <FormField
              id="dateOfBirth"
              label="Date of Birth"
              required
              componentType="controlled"
              error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
            >
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`${styles.input} ${
                  touched.dateOfBirth && errors.dateOfBirth ? styles.inputError : ''
                }`}
                aria-invalid={!!(touched.dateOfBirth && errors.dateOfBirth)}
              />
            </FormField>

            <FormField
              id="semester"
              label="Enrollment Semester"
              required
              componentType="controlled"
            >
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={styles.select}
              >
                {AVAILABLE_SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Controlled: Course / Degree Program */}
          <FormField
            id="course"
            label="Degree Program / Course"
            required
            componentType="controlled"
            error={touched.course ? errors.course : undefined}
          >
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              onBlur={() => handleBlur('course')}
              className={`${styles.select} ${
                touched.course && errors.course ? styles.selectError : ''
              }`}
              aria-invalid={!!(touched.course && errors.course)}
            >
              <option value="">-- Choose Academic Program --</option>
              {AVAILABLE_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </FormField>

          {/* Controlled: Gender Radio Group */}
          <FormField
            label="Gender Identification"
            required
            componentType="controlled"
            error={touched.gender ? errors.gender : undefined}
          >
            <div className={styles.radioGroup} role="radiogroup" aria-label="Gender Identification">
              {(['Male', 'Female', 'Other'] as Gender[]).map((genderOption) => (
                <label key={genderOption} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={formData.gender === genderOption}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span>{genderOption}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* UNCONTROLLED COMPONENT SECTION */}
          <div className={styles.uncontrolledSection}>
            <span className={styles.uncontrolledBadge}>
              ⚡ Uncontrolled Components (Demonstrating useRef &amp; Direct DOM Access)
            </span>

            {/* Uncontrolled: File / ID Upload */}
            <FormField
              id="studentDoc"
              label="Student Identification Card (Uncontrolled File Input)"
              componentType="uncontrolled"
              helperText="Managed by the browser DOM through React useRef"
            >
              <input
                ref={fileInputRef}
                id="studentDoc"
                type="file"
                accept="image/*,.pdf"
                className={styles.input}
              />
            </FormField>

            {/* Uncontrolled: Remarks / Counselor Notes */}
            <FormField
              id="notes"
              label="Counselor Notes / Special Accommodation"
              componentType="uncontrolled"
              helperText="Value is read via notesRef.current.value on form submit without re-rendering state"
            >
              <textarea
                ref={notesRef}
                id="notes"
                rows={2}
                placeholder="Optional: Enter any prior credits, honors, or special instructions..."
                defaultValue=""
                className={styles.textarea}
              />
            </FormField>
          </div>

          {/* Controlled: Agreement Checkbox */}
          <div className={styles.checkboxContainer}>
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={styles.checkboxInput}
            />
            <label htmlFor="agreeToTerms" className={styles.checkboxLabel}>
              I certify that all supplied academic information is accurate and agree to university admission guidelines.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className={styles.errorMessage} style={{ marginTop: '-0.75rem', marginBottom: '1rem' }} role="alert">
              ⚠️ {errors.agreeToTerms}
            </p>
          )}

          {/* Action Buttons */}
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
              <span>Submit Registration</span>
              <span>&rarr;</span>
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
