import Layout from "../../common/Layout";
import GetTable from "../common/GetTable";

// function fnInsert(row: any, data: any) {
//     // console.log('insert ' + row.id + ' ' + cells.id);
// }

// function fnUpdate(row: any, org : any, val : any) {
//     // console.log('update ' + row.id + ' ' + org);
//     // console.log('org ' + org.domnNm + ' ' + org.domnGroupNm);
//     // console.log('val ' + val.domnNm + ' ' + val.domnGroupNm);
//     // {data.map(col => {
//     //     console.log(col);
//     // })}
// }

// function fnDelete(row: any) {
//     // console.log('delete ' + row.id );
// }

const Domain = () => {
    return (
        <Layout>
            <GetTable
                addr="/postgres/list/domain"
                title="표준도메인"
                editMode='modal'
                enableEdit='false'
                // fnInsert={fnInsert}
                // fnUpdate={fnUpdate}
                // fnDelete={fnDelete}
            />
        </Layout>
    )
}

export default Domain;
