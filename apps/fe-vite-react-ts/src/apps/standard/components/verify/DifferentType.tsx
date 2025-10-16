import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const DifferentType = () => {
    return (
        <Layout>
            <GetTable addr="/postgres/find/DifferentType" title="타입다른것" />
        </Layout>
    )
}

export default DifferentType;
