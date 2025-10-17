import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Typography } from "@mui/material";
import { useAppEnvStore } from "../../../../appmain/app.env";
import GetDataFrom from "../../common/GetDataFrom";
import styles from '../../common/Layout.module.scss';

const GetSummary = () => {

    const env = useAppEnvStore((state) => state.env);
    const appServer = env.apps?.urlApiServerJava || '';
    const api = appServer + '/standard';

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: '항목이름', size: 150, },
            { accessorKey: 'count', header: '개수', size: 150, },
        ],
        [],
    );

    const stdWord = GetDataFrom(api + '/postgres/list/word/data');
    const stdTerm = GetDataFrom(api + '/postgres/list/term/data');
    const stdDomn = GetDataFrom(api + '/postgres/list/domain/data');
    const notWord = GetDataFrom(api + '/postgres/find/UndefinedWord/data');
    const notTerm = GetDataFrom(api + '/postgres/find/UndefinedTerm/data');
    const notDomn = GetDataFrom(api + '/postgres/find/UndefinedDomn/data');
    const difTerm = GetDataFrom(api + '/postgres/find/DifferentTerm/data');
    const difType = GetDataFrom(api + '/postgres/find/DifferentType/data');

    const data = [
        { name: '표준단어개수', count: stdWord.length, gotoLink: '/ListWord', },
        { name: '표준용어개수', count: stdTerm.length, gotoLink: '/ListTerm',  },
        { name: '표준도메인개수', count: stdDomn.length, gotoLink: '/ListDomain',  },
        { name: '단어미정의', count: notWord.length, gotoLink: '/UndefinedWord',  },
        { name: '용어미정의', count: notTerm.length, gotoLink: '/UndefinedTerm', },
        { name: '도메인미정의', count: notDomn.length, gotoLink: '/UndefinedDomn', },
        { name: '용어다른것', count: difTerm.length, gotoLink: '/DifferentTerm', },
        { name: '타입다른것', count: difType.length, gotoLink: '/DifferentType', },
    ];

    const navigate = useNavigate();

    const table = useMaterialReactTable({
        columns,
        data,
        editDisplayMode: 'cell',            // 'modal' | 'cell' | 'row' | 'table' | 'custom
        enableColumnFilters: false,
        enableFilters: false,
        enableHiding: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableRowSelection: false,
        enablePagination: false,
        enableRowNumbers: true,
        rowNumberDisplayMode: 'original',   // 'original' | 'static'
        initialState: {
            density: 'compact',             // 'comfortable' | 'compact' | 'spacious'
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (e) => {
                console.info(e, row.id)
                navigate(data[parseInt(row.id)].gotoLink);
            }
        }),
    });

    return (
        <div>
            <div>
                <Typography align="center" variant="h5" component="h5">
                    {"표준현황"}
                </Typography>
            </div>
            <div className={styles.summary}>
                <MaterialReactTable
                    table={table}
                />
            </div>
        </div>
    )
}

export default GetSummary;
