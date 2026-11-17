import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} CareerPulse Inc. All rights reserved. Equal Opportunity Employer.
        </p>
        <div className={styles.links}>
          <a href="#privacy" className={styles.link}>Applicant Privacy Policy</a>
          <a href="#terms" className={styles.link}>Candidate Terms of Use</a>
          <a href="#compliance" className={styles.link}>EEOC Compliance</a>
          <a href="#support" className={styles.link}>Recruitment Support</a>
        </div>
      </div>
    </footer>
  );
}
