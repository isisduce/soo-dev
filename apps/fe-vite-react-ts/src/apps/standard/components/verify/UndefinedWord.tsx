import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

const UndefinedWord = () => {
    return (
        <Layout>
            <GetTable addr="/postgres/find/UndefinedWord" title="단어미정의" />
        </Layout>
    )
}

export default UndefinedWord;
