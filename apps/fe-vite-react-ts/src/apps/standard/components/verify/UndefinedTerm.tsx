import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const UndefinedTerm = () => {
    return (
        <Layout>
            <GetTable addr="/postgres/find/UndefinedTerm" title="용어미정의" />
        </Layout>
    )
}

export default UndefinedTerm;
