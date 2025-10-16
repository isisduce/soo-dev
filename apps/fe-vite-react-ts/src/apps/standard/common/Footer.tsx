import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.contents}>
                <h2 className={styles.title}>
                    Copyright (c) soo
                </h2>
            </div>
        </footer>
    )
}

export default Footer;
