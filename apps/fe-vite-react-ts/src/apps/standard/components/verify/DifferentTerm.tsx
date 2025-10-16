import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const DifferentTerm = () => {
    return (
        <Layout>
            <GetTable addr="/postgres/find/DifferentTerm" title="용어다른것" />
        </Layout>
    )
}

export default DifferentTerm;
