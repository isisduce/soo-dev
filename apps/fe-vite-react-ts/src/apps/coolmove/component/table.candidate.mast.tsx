import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, type MRT_Cell, type MRT_ColumnDef } from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppEnvStore } from '../../../appmain/app.env';
import { CoolmoveCode } from '../types/types';
import type { DtoCandidateMast } from '../dto/dto.candidate';
import imgDefaultUser from '/styles/images/user-img-120.png';
import imgXlsx from '/styles/images/ico-excel-18.svg';
import imgKakao from '/styles/images/ico-kakao.svg';
import DateHelper from '../../../common/helper/date.helper';

interface TableCandidateMastProps {
    data?: DtoCandidateMast[];
    isLoading?: boolean;
    selectedCandidateMast?: DtoCandidateMast;
    setSelectedCandidateMast?: (candidateMast: DtoCandidateMast | undefined) => void;
    onNew?: () => void;
    onRemove?: (v?: DtoCandidateMast) => void;
    onSaveAsDraft?: (v?: DtoCandidateMast) => void;
    onSaveAsFinal?: (v?: DtoCandidateMast) => void;
    onSendToMobile?: (v?: DtoCandidateMast) => void;
    onOpenToVoters?: (v?: DtoCandidateMast) => void;
    onDownloadVoters?: (v?: DtoCandidateMast) => void;
    onDownloadReport?: (v?: DtoCandidateMast) => void;
}

export const TableCandidateMast: React.FC<TableCandidateMastProps> = (props: TableCandidateMastProps) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const enableEditing = false;
    const [selectedRow, setSelectedRow] = useState<string | null | undefined>();
    const noSelectHeaders: string[] = [ '유권자', '문자전송', '삭제', ];

    // ====================================================================================================

    const handleNew = () => {
        setSelectedRow(undefined);
        props.setSelectedCandidateMast?.(undefined);
        props.onNew?.();
    };

    const handleRemove = async (row: DtoCandidateMast) => {
        props.onRemove?.(row);
    }

    // ====================================================================================================

    const cellClub = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        const candidateItem = candidateMast.candidates && candidateMast.candidates.length > 0 ? candidateMast.candidates[0] : undefined;
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
                {candidateItem?.clubNm}
            </Box>
        );
    }, []);

    const cellPlayer = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        const candidateItem = candidateMast.candidates && candidateMast.candidates.length > 0 ? candidateMast.candidates[0] : undefined;
        const imgSrc = candidateItem?.photoPathNm ? `${imgServer}${candidateItem.photoPathNm}` : imgDefaultUser;
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }} >
                <img
                    src={imgSrc}
                    alt={candidateItem?.playerNm}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', }}
                />
                {candidateItem?.playerNm}
            </Box>
        );
    }, [imgServer]);

    const cellBegDt = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        return (
            <Box>
                <Box>
                    {DateHelper.getYYMMDD(cell.row.original.begDt) || '-'}
                </Box>
                <Box>
                    {DateHelper.gethms(cell.row.original.begDt)}
                </Box>
            </Box>
        );
    }, []);

    const cellEndDt = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        return (
            <Box>
                <Box>{DateHelper.getYYMMDD(cell.row.original.endDt) || '-'}</Box>
                <Box>{DateHelper.gethms(cell.row.original.endDt)}</Box>
            </Box>
        );
    }, []);

    const cellStatus = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        const formatParticipants = (participants: number) => {
            return participants.toLocaleString();
        };
        switch (candidateMast.status) {
            case CoolmoveCode.STATUS.DRAFT:
                return (
                    <>
                        <div>{candidateMast.begDt}</div>
                        <span className="badge draft">임시저장</span>
                    </>
                );
            case CoolmoveCode.STATUS.FINAL:
                return (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            // onStatusClick?.(row.status);
                        }}
                    >
                        {formatParticipants(candidateMast.votersCount || 0)} 참여
                    </a>
                );
            case CoolmoveCode.STATUS.CLOSE:
                return (
                    <>
                        <div>{candidateMast.endDt}</div>
                        <span className="badge end">종료</span>
                    </>
                );
            default:
                return null;
        }
    }, []);

    const cellVoters = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        const disabled = !!candidateMast.votersPathNm === false;
        const imgSrc = imgXlsx;
        return (
            <Box>
                <img
                    src={imgSrc}
                    alt={'voters'}
                    style={{ backgroundColor: '#007E60', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid transparent',
                        pointerEvents: disabled ? 'none' : 'auto',
                        opacity: disabled ? 0.5 : 1,
                        filter: disabled ? 'grayscale(100%)' : 'none'
                    }}
                    onClick={() => {
                        alert('downlaod');
                    }}
                />
            </Box>
        );
    }, []);

    const cellSendMms = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        const disabled = !!candidateMast.votersPathNm === false;
        const imgSrc = imgKakao;
        return (
            <Box>
                <img
                    src={imgSrc}
                    alt={'voters'}
                    style={{ backgroundColor: '#FEE500', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid transparent',
                        pointerEvents: disabled ? 'none' : 'auto',
                        opacity: disabled ? 0.5 : 1,
                        filter: disabled ? 'grayscale(100%)' : 'none'
                    }}
                    onClick={() => {
                        alert('send Kakao');
                    }}
                />
            </Box>
        );
    }, []);

    const cellPublic = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        return (
            <Box>
                {candidateMast.pubYn === 'Y' ? '공개' : '비공개'}
            </Box>
        );
    }, []);

    const cellReport = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        return (
            <Button
                variant="outlined"
                size="small"
                onClick={() => { props.onDownloadReport?.(candidateMast); }}
                disabled={candidateMast.status !== CoolmoveCode.STATUS.CLOSE}
            >
                다운로드
            </Button>
        );
    }, []);

    const cellRemove = useCallback(({ cell }: { cell: MRT_Cell<DtoCandidateMast> }) => {
        const candidateMast = cell.row.original;
        return (
            <IconButton
                color='error'
                size='small'
                onClick={() => { handleRemove(candidateMast); }}
            ><DeleteIcon /></IconButton>
        );
    }, []);

    // ====================================================================================================

    let columns: MRT_ColumnDef<DtoCandidateMast>[] = useMemo<MRT_ColumnDef<DtoCandidateMast>[]>(() => [], []);
        columns = [
            ...columns,
            {
                accessorKey: 'no',
                header: 'NO',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
            },
            {
                accessorKey: 'club',
                header: '소속',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellClub,
            },
            {
                accessorKey: 'player',
                header: '이름',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellPlayer,
            },
            {
                accessorKey: 'begDt',
                header: '공개일시',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellBegDt,
            },
            {
                accessorKey: 'endDt',
                header: '종료일시',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellEndDt,
            },
            {
                accessorKey: 'status',
                header: '상태',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellStatus,
            },
            {
                accessorKey: 'voters',
                header: '유권자',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellVoters,
            },
            {
                accessorKey: 'sendMms',
                header: '문자전송',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellSendMms,
            },
            {
                accessorKey: 'public',
                header: '공개여부',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellPublic,
            },
            {
                accessorKey: 'report',
                header: '결과보고서',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellReport,
            },
            {
                accessorKey: 'remove',
                header: '삭제',
                muiTableHeadCellProps: { align: 'center' },
                muiTableBodyCellProps: { align: 'center' },
                size: 50,
                enableEditing: false,
                enableSorting: false,
                Cell: cellRemove,
            },
        ];

    // ====================================================================================================

    const RenderTopToolbarCustomActions = () => {
        return (
            <Box sx={{ width: '100%', display: 'flex', gap: '1rem', }} >
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <h2 style={{ margin: 0, textAlign: 'center' }}>공약 선택 현황</h2>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ position: 'absolute', left: 0, marginRight: 2 }}
                    onClick={handleNew}
                >신규등록</Button>
            </Box>
        )
    }

    // ====================================================================================================

    const table = useMaterialReactTable({
        columns: columns,
        data: props.data || [],
        initialState: { density: 'compact', showColumnFilters: false, },
        state: { isLoading: props.isLoading, showProgressBars: props.isLoading, },
        getRowId: (row: any) => row.uuid,
        enableClickToCopy: false,
        enableColumnActions: false,     // default true
        enableColumnOrdering: false,    // default false
        enableDensityToggle: false,     // default true
        enableHiding:  false,           // default true
        enableFilters: false,           // default true
        enableFullScreenToggle: false,  // default true
        // createDisplayMode: 'row',     // 'custom', 'modal', 'row'
        // editDisplayMode: 'row',       // 'custom', 'modal', 'row'
        enableTopToolbar: true,         // default true
        renderTopToolbarCustomActions: RenderTopToolbarCustomActions,
        enableEditing: enableEditing,
        positionActionsColumn: 'last',
        // renderRowActions: RenderRowActions,
        enableBottomToolbar: false,
        enablePagination: false,
        autoResetPageIndex: false,
        paginationDisplayMode: 'pages',
        muiPaginationProps: { color: 'primary', shape: 'rounded', variant: 'outlined', showRowsPerPage: false, rowsPerPageOptions: [10], showFirstButton: false, showLastButton: false, hidePrevButton: true, hideNextButton: true, },
        // onPaginationChange: setPagination,
        positionToolbarAlertBanner: 'bottom',
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (e) => {
                const target = e.target as HTMLElement;
                const rowElement = target.closest('tr');
                const cell = target.closest('td');
                if (rowElement && cell) {
                    const cellIndex = Array.from(rowElement.children).indexOf(cell);
                    if (columns[cellIndex] && columns[cellIndex].header !== undefined) {
                        if (!noSelectHeaders.includes(columns[cellIndex].header)) {
                            if (selectedRow !== row.id) {
                                setSelectedRow(row.id);
                                props.setSelectedCandidateMast?.(row.original);
                            } else {
                                setSelectedRow('');
                                props.setSelectedCandidateMast?.(undefined);
                            }
                        }
                    }
                }
            },
            sx: {
                backgroundColor: selectedRow === row.id ? '#FFF2BA' : 'inherit', // 선택된 행 색상 강조
                cursor: 'pointer',
            },
        }),
    });

    // ====================================================================================================

    return (
        <MaterialReactTable table={table} />
    );

};
