import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const Entity = () => {
    return (
        <Layout>
            <GetTable
                addr="/postgres/list/entity"
                title="엔티티정의서"
            />
        </Layout>
    )
}

export default Entity;
