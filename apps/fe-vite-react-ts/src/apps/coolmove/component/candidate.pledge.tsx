import React, { useState } from 'react';
import { Box, Radio } from '@mui/material';
import dragHandle from '/styles/images/ico-list-24.svg';
import { type CoolmoveStatus, type CoolmoveType, CoolmoveCode } from '../types/types';
import { type DtoCandidateItem, type DtoCandidateVote } from '../dto/dto.candidate';

interface CandidatePledgeProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    setCandidateItem?: (candidateItem: DtoCandidateItem) => void;
    candidateVote?: DtoCandidateVote;
    setCandidateVote?: (candidateVote: DtoCandidateVote) => void;
}

export const CandidatePledge: React.FC<CandidatePledgeProps> = (props: CandidatePledgeProps) => {

    const pledgeMaxCount = 5;
    const pledgeMaxLength = 40;

    const handlePledgeChange = (index: number, value: string) => {
        const newPledges = props.candidateItem?.pledges?.map((pledge, i) =>
            i === index ? value : pledge
        );
        if (props.candidateItem) {
            props.setCandidateItem?.({ ...props.candidateItem, pledges: newPledges });
        }
    };

    // 드래그 앤 드롭 상태
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        const newPledges = props.candidateItem?.pledges ? [...props.candidateItem.pledges] : [];
        const [removed] = newPledges.splice(draggedIndex, 1);
        newPledges.splice(index, 0, removed);
        if (props.candidateItem) {
            props.setCandidateItem?.({ ...props.candidateItem, pledges: newPledges });
        }
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getLength = (text: string): number => {
        return text.length;
    };

    const editEnabled = props.status === CoolmoveCode.STATUS.EMPTY || props.status === CoolmoveCode.STATUS.DRAFT;

    return (
        <Box sx={{ width: '100%', backgroundColor: '#EFF9FF', padding: 2, borderRadius: 1, marginBottom: 0 }}>
            {/* <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}> */}
                <label>
                    {editEnabled && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                            <span style={{fontSize:14, color:'#888', fontWeight: 'bold', marginBottom: 4 }}>공약 입력</span>
                            <span style={{fontSize:12, color:'#888', marginBottom:2}}>공약 {pledgeMaxCount}개를 입력할 수 있습니다.</span>
                            <span style={{fontSize:12, color:'#888' }}>
                                <img src={dragHandle} height={16} width={16} alt="" style={{display:'inline-block', verticalAlign:'middle', marginRight: 4 }} />
                                아이콘을 움직여 순서를 변경할 수 있습니다.
                            </span>
                        </Box>
                    )}
                    {props.type === CoolmoveCode.TYPE.PROMISE && props.status === CoolmoveCode.STATUS.FINAL && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{fontSize:16, color:'#888' }}>좋아하는 공약을 선택해주세요</span>
                        </Box>
                    )}
                    {props.type === CoolmoveCode.TYPE.PROMISE && props.status === CoolmoveCode.STATUS.CLOSE && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                            <span style={{fontSize:12, color:'#888', marginRight:8 }}>공개중</span>
                            <span style={{fontSize:12, color:'#888' }}>공약 선호도 순위</span>
                        </Box>
                    )}
                </label>
            <Box sx={{ height: 8 }} />
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#888' }}>
                {props.candidateItem?.pledges?.map((pledge, index) => (
                    <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{ width: '100%',position: 'relative' }}>
                            <textarea
                                disabled={!editEnabled || draggedIndex != null}
                                style={{ width: '100%', height: 60, padding: 8, resize: 'none', boxSizing: 'border-box', position: 'relative' }}
                                maxLength={pledgeMaxLength}
                                placeholder={
                                    editEnabled ? `공약을 ${pledgeMaxLength}자 이내로 입력해 주세요.` : '공약 없음'
                                }
                                value={pledge ?? ''}
                                onChange={(e) => handlePledgeChange(index, e.target.value)}
                            />
                            {editEnabled && (
                                <span
                                    style={{ position: 'absolute', right: '10px', bottom: '10px', fontSize: '11px', color: '#888' }}>
                                    <em>{getLength(pledge)}</em>/{pledgeMaxLength}
                                </span>
                            )}
                        </Box>
                        {editEnabled && (
                            <Box
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                onDragEnd={handleDragEnd}
                                style={{
                                    opacity: draggedIndex === index ? 0.5 : 1,
                                    border: draggedIndex === index ? '1px dashed #888' : undefined,
                                    cursor: 'move',
                                    marginBottom: 8,
                                    width: '50px',
                                    right: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span style={{fontSize:12, color:'#888'}}><img src={dragHandle} alt="드래그 핸들" /></span>
                            </Box>
                        )}
                        {props.type === CoolmoveCode.TYPE.PROMISE && props.status === CoolmoveCode.STATUS.FINAL && (
                            <Box>
                                <Radio
                                    // disabled={!!pledge || pledge.length === 0}
                                    checked={props.candidateVote?.pledgeNo === index}
                                    value={index + 1}
                                    onClick={() => {
                                        if (props.candidateVote && props.setCandidateVote) {
                                            const newVote = { ...props.candidateVote, pledgeNo: index };
                                            props.setCandidateVote(newVote);
                                        }
                                    }}
                                />
                            </Box>
                        )}
                        {props.type === CoolmoveCode.TYPE.PROMISE && props.status === CoolmoveCode.STATUS.CLOSE && (
                            <Box sx={{ width: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Box>
                                    <span style={{ fontSize: '16px', color: '#888', fontWeight: 'bold', marginRight: 2 }}>
                                        {props.candidateItem?.pledgeOrder && props.candidateItem.pledgeOrder[index] !== undefined ?
                                            props.candidateItem.pledgeOrder[index] : index + 1}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                            위
                                    </span>
                                </Box>
                                <span>
                                    {props.candidateItem?.pledgeSelectedCounts && props.candidateItem.pledgeSelectedCounts[index] !== undefined ? (
                                        <em style={{ fontSize: '14px', color: '#000' }}>{props.candidateItem.pledgeSelectedCounts[index]}</em>
                                    ) : (
                                        <em style={{ fontSize: '14px', color: '#000' }}>0</em>
                                    )}
                                </span>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
