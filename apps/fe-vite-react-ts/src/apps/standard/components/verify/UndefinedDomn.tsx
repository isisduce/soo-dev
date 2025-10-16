import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const UndefinedDomn = () => {
    return (
        <Layout>
            <GetTable addr="/postgres/find/UndefinedDomain" title="도메인미정의" />
        </Layout>
    )
}

export default UndefinedDomn;
