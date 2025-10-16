import styles from './Header.module.scss';
import isopng from './images/iso.png';

const Header = () => {
    return (
        <header className={styles.header}>
            {/* <div className={styles.contents}> */}
                <div>
                    <h4>
                        <a href="/">
                            <img src={isopng} alt="ISO" />표준
                        </a>
                    </h4>
                </div>
                <nav>
                    <ul>
                        <li><h5><a href="/ListWord">단어</a></h5></li>
                        <li><h5><a href="/ListTerm">용어</a></h5></li>
                        <li><h5><a href="/ListDomain">도메인</a></h5></li>
                        <li><h5> :: </h5></li>
                        {/* <li><h5><a href="/Entity">엔티티</a></h5></li>
                        <li><h5><a href="/Attrib">어트리뷰트</a></h5></li>
                        <li><h5><a href="/Tables">테이블</a></h5></li>
                        <li><h5><a href="/Column">컬럼</a></h5></li> */}
                        <li><h5> :: </h5></li>
                        <li><h5><a href="/UndefinedWord">단어미정의</a></h5></li>
                        <li><h5><a href="/UndefinedTerm">용어미정의</a></h5></li>
                        <li><h5><a href="/UndefinedDomn">도메인미정의</a></h5></li>
                        <li><h5><a href="/DifferentTerm">용어다른것</a></h5></li>
                        <li><h5><a href="/DifferentType">타입다른것</a></h5></li>
                    </ul>
                </nav>
            {/* </div> */}
        </header>
    )
}

export default Header;
