import { BrowserRouter, Route, Routes } from "react-router-dom";
import Attrib from "./components/standard/Attrib";
import Column from "./components/standard/Column";
import DifferentTerm from "./components/verify/DifferentTerm";
import DifferentType from "./components/verify/DifferentType";
import Domain from "./components/standard/Domain";
import Entity from "./components/standard/Entity";
import Tables from "./components/standard/Tables";
import Term from "./components/standard/Term";
import Word from "./components/standard/Word";
import Summary from "./components/Summary";
import UndefinedWord from "./components/verify/UndefinedWord";
import UndefinedTerm from "./components/verify/UndefinedTerm";
import UndefinedDomn from "./components/verify/UndefinedDomn";
import styles from './DatabaseRoot.module.scss';

export const DatabaseRoot = () => {
    return (
        <div className={styles.menu}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={Summary}></Route>
                    <Route path="/ListWord" Component={Word}></Route>
                    <Route path="/ListTerm" Component={Term}></Route>
                    <Route path="/ListDomain" Component={Domain}></Route>
                    <Route path="/ListEntity" Component={Entity}></Route>
                    <Route path="/ListAttrib" Component={Attrib}></Route>
                    <Route path="/ListTables" Component={Tables}></Route>
                    <Route path="/ListColumn" Component={Column}></Route>
                    <Route path="/UndefinedWord" Component={UndefinedWord}></Route>
                    <Route path="/UndefinedTerm" Component={UndefinedTerm}></Route>
                    <Route path="/UndefinedDomn" Component={UndefinedDomn}></Route>
                    <Route path="/DifferentTerm" Component={DifferentTerm}></Route>
                    <Route path="/DifferentType" Component={DifferentType}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
