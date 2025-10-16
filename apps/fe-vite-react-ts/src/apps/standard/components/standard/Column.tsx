import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const Column = () => {
    return (
        <Layout>
            <GetTable
                addr="/postgres/list/column"
                title="컬럼정의서"
            />
        </Layout>
    )
}

export default Column;
