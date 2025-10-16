import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const Tables = () => {
    return (
        <Layout>
            <GetTable
                addr="/postgres/list/tables"
                title="테이블정의서"
            />
        </Layout>
    )
}

export default Tables;
