import type { RouterData } from '../../common/router/router.data';
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

export const routerConst = {
    STANDARD: '/standard',
    WORD: "/ListWord",
    TERM: "/ListTerm",
    DOMAIN: "/ListDomain",
    ENTITY: "/ListEntity",
    ATTRIB: "/ListAttrib",
    TABLES: "/ListTables",
    COLUMN: "/ListColumn",
    UNDEFINED_WORD: "/UndefinedWord",
    UNDEFINED_TERM: "/UndefinedTerm",
    UNDEFINED_DOMN: "/UndefinedDomn",
    DIFFERENT_TERM: "/DifferentTerm",
    DIFFERENT_TYPE: "/DifferentType",

};

export const routerData: RouterData[] = [
    { path: routerConst.STANDARD, label: 'Standard', element: <Summary /> },
    { path: routerConst.WORD, label: 'Word', element: <Word /> },
    { path: routerConst.TERM, label: 'Term', element: <Term /> },
    { path: routerConst.DOMAIN, label: 'Domain', element: <Domain /> },
    { path: routerConst.ENTITY, label: 'Entity', element: <Entity /> },
    { path: routerConst.ATTRIB, label: 'Attrib', element: <Attrib /> },
    { path: routerConst.TABLES, label: 'Tables', element: <Tables /> },
    { path: routerConst.COLUMN, label: 'Column', element: <Column /> },
    { path: routerConst.UNDEFINED_WORD, label: 'Undefined Word', element: <UndefinedWord /> },
    { path: routerConst.UNDEFINED_TERM, label: 'Undefined Term', element: <UndefinedTerm /> },
    { path: routerConst.UNDEFINED_DOMN, label: 'Undefined Domn', element: <UndefinedDomn /> },
    { path: routerConst.DIFFERENT_TERM, label: 'Different Term', element: <DifferentTerm /> },
    { path: routerConst.DIFFERENT_TYPE, label: 'Different Type', element: <DifferentType /> },
];
