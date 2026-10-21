/**
 * Validation rules and regex specs matching MLCOE Backend API Specification v1.0
 */

export const BRANCH_OPTIONS = [
  'CSE',
  'AIML',
  'CSE-AIML',
  'CSE-DS',
  'CS-IT',
  'IT',
  'ECE',
  'EN',
  'ME',
  'CE',
];

export const GENDER_OPTIONS = ['Male', 'Female'];
export const RESIDENCE_OPTIONS = ['DayScholar', 'Hostler'];

// Regex patterns
const NAME_REGEX = /^[a-zA-Z]+([a-zA-Z\s.'-]*[a-zA-Z])?$/;
const STUDENT_NO_REGEX = /^(25|26)[0-9]{5,6}[a-zA-Z]?$/;
const EMAIL_REGEX = /^[a-zA-Z_-]+(25|26)[0-9]*@akgec\.ac\.in$/i;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const UNSTOP_REGEX = /^[a-zA-Z0-9._-]{2,40}$/; const XSS_FORBIDDEN_CHARS = /[<>$`]/;

/**
 * Validates a single field
 * @param {string} name - Field name
 * @param {string} value - Current value
 * @param {object} allValues - Full form state (for cross-validation)
 * @returns {string} Error message or empty string
 */
export const validateField = (name, value, allValues = {}) => {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'name':
      if (!trimmed) return 'Full Name is required.';
      if (XSS_FORBIDDEN_CHARS.test(trimmed)) return 'Name contains disallowed special characters (<, >, $, `).';
      if (trimmed.length < 2 || trimmed.length > 50) return 'Name must be between 2 and 50 characters.';
      if (!NAME_REGEX.test(trimmed)) return 'Name can only contain alphabets, spaces, dots, and hyphens.';
      return '';

    case 'studentNo':
      if (!trimmed) return 'Student Number is required.';
      if (/^(24|23|22|21|20)/.test(trimmed)) {
        return 'Registration is restricted to Batch 25 & 26 students.';
      }
      if (!STUDENT_NO_REGEX.test(trimmed)) {
        return 'Must start with 25 or 26 and contain 7 to 8 alphanumeric characters.';
      }
      return '';

    case 'email': {
      if (!trimmed) return 'College Email is required.';
      const lowerEmail = trimmed.toLowerCase();
      if (!lowerEmail.endsWith('@akgec.ac.in')) {
        return 'Must be an official AKGEC email ending with @akgec.ac.in';
      }
      if (/^[a-zA-Z_-]+(24|23|22|21|20)/.test(lowerEmail)) {
        return 'Registration is restricted to Batch 25 & 26 students.';
      }
      if (!EMAIL_REGEX.test(lowerEmail)) {
        return 'Email must contain batch digits 25 or 26 right after your name prefix.';
      }
      return '';
    }

    case 'gender':
      if (!trimmed) return 'Please select your gender.';
      if (!GENDER_OPTIONS.includes(trimmed)) return 'Invalid gender selection.';
      return '';

    case 'branch':
      if (!trimmed) return 'Please select your branch.';
      if (!BRANCH_OPTIONS.includes(trimmed)) return 'Invalid branch selection.';
      return '';

    case 'phoneNo': {
      const cleanPhone = (value || '').toString().replace(/[\s-]/g, '');
      if (!cleanPhone) return 'Phone number is required.';
      if (!PHONE_REGEX.test(cleanPhone)) {
        return 'Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
      }
      return '';
    }

    case 'residence':
      if (!trimmed) return 'Please select your residence type.';
      if (!RESIDENCE_OPTIONS.includes(trimmed)) return 'Invalid residence selection.';
      return '';

    case 'unstopId':
      if (!trimmed) return 'Unstop User ID is required.';
      if (trimmed.length < 2 || trimmed.length > 40) return 'Unstop ID must be between 2 and 40 characters.';
      if (!UNSTOP_REGEX.test(trimmed)) {
        return 'Unstop ID can only include letters, numbers, dots, hyphens, and underscores.';
      }
      return '';

    default:
      return '';
  }
};

/**
 * Validates the entire form and cross-checks studentNo with email
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  // Cross-field validation: Student number must match the number within the college email
  if (!errors.studentNo && !errors.email && formData.studentNo && formData.email) {
    const emailPrefix = formData.email.split('@')[0];
    const emailDigits = emailPrefix.match(/(25|26)[0-9]*/);
    const primaryDigits = formData.studentNo.replace(/[a-zA-Z]/g, '');

    if (!emailDigits || !formData.studentNo.toLowerCase().includes(emailDigits[0])) {
      errors.email = `Student number in email does not match entered Student Number (${formData.studentNo}).`;
    }
  }

  return errors;
};