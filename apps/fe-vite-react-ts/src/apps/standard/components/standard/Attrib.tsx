import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const Attrib = () => {
    return (
        <Layout>
            <GetTable
                addr="/postgres/list/attrib"
                title="어트리뷰트정의서"
                insert=""
                update=""
                delete=""
            />
        </Layout>
    )
}

export default Attrib;
