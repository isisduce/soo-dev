import Footer from "./Footer";
import Header from "./Header";
import styles from './Layout.module.scss';

const Layout = (
    props: {
        children: React.ReactNode
    }
) => {
    return (
        <div className={styles.layout} style={{ width: '100%' }}>
            <Header />
            <main className={styles.main}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
