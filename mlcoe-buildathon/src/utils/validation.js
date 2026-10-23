export const BRANCH_OPTIONS = [
  'CSE', 'AIML', 'CSE-AIML', 'CSE-DS', 'CS-IT', 'IT', 'ECE', 'EN', 'ME', 'CE'
];
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const RESIDENCE_OPTIONS = ['DayScholar', 'Hostler'];
export const YEAR_OPTIONS = ['1st Year', '2nd Year'];

const NAME_REGEX = /^[a-zA-Z]+([a-zA-Z\s.'-]*[a-zA-Z])?$/;
const STUDENT_NO_REGEX = /^(25|26)[0-9]{5,6}[a-zA-Z]?$/;
const EMAIL_REGEX = /^[a-zA-Z_-]+(25|26)[0-9]*@akgec\.ac\.in$/i;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const ROLL_NO_REGEX = /^\d{10,15}$/;
const XSS_FORBIDDEN_CHARS = /[<>$`]/;

export const validateField = (name, value, allValues = {}) => {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'name':
      if (!trimmed) return 'Full Name is required.';
      if (XSS_FORBIDDEN_CHARS.test(trimmed)) return 'Contains disallowed characters.';
      if (trimmed.length < 2 || trimmed.length > 50) return 'Must be 2-50 characters.';
      if (!NAME_REGEX.test(trimmed)) return 'Alphabets, spaces, dots, hyphens only.';
      return '';

    case 'studentNo':
      if (!trimmed) return 'Student Number is required.';
      if (/^(24|23|22|21|20)/.test(trimmed)) return 'Only Batch 25 & 26 students are eligible.';
      if (!STUDENT_NO_REGEX.test(trimmed)) return 'Must start with 25 or 26 and contain 7-8 digits.';
      return '';

    case 'universityRollNo':
      if (allValues.year === '2nd Year') {
        if (!trimmed) return 'University roll number is required for 2nd Year students.';
        if (!ROLL_NO_REGEX.test(trimmed)) return 'Must be a 10 to 15 digit number.';
      }
      return '';

    case 'email':
      if (!trimmed) return 'College Email is required.';
      const lowerEmail = trimmed.toLowerCase();
      if (!lowerEmail.endsWith('@akgec.ac.in')) return 'Must end with @akgec.ac.in';
      if (/^[a-zA-Z_-]+(24|23|22|21|20)/.test(lowerEmail)) return 'Only Batch 25 & 26 eligible.';
      if (!EMAIL_REGEX.test(lowerEmail)) return 'Must contain batch 25 or 26 after name.';
      return '';

    case 'gender':
      if (!GENDER_OPTIONS.includes(trimmed)) return 'Invalid gender.';
      return '';

    case 'branch':
      if (!BRANCH_OPTIONS.includes(trimmed)) return 'Invalid branch.';
      return '';

    case 'year':
      if (!YEAR_OPTIONS.includes(trimmed)) return "Must be '1st Year' or '2nd Year'.";
      return '';

    case 'phoneNo':
      const cleanPhone = (value || '').toString().replace(/[\s-]/g, '');
      if (!PHONE_REGEX.test(cleanPhone)) return 'Valid 10-digit number required.';
      return '';

    case 'residence':
      if (!RESIDENCE_OPTIONS.includes(trimmed)) return 'Invalid residence.';
      return '';

    default:
      return '';
  }
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  Object.keys(formData).forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  if (!errors.studentNo && !errors.email && formData.studentNo && formData.email) {
    const emailPrefix = formData.email.split('@')[0];
    const emailDigits = emailPrefix.match(/(25|26)[0-9]*/);
    if (!emailDigits || !formData.studentNo.toLowerCase().includes(emailDigits[0])) {
      errors.email = "Student number does not match the student ID in your college email address.";
    }
  }
  return errors;
};