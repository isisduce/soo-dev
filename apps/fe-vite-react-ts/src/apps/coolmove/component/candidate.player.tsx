import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import defaultUserImg from '/styles/images/user-img-120.png';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import { emptyCandidateItem, type DtoCandidateItem } from '../dto/dto.candidate';

interface CandidatePlayerProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    onCandidateItemChange?: (candidate: DtoCandidateItem) => void;
    onPhotoUpload?: () => void;
}

export const CandidatePlayer: React.FC<CandidatePlayerProps> = (props: CandidatePlayerProps) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const playerHeadWidth = 40;
    const playerNameMaxLength = 10;
    const photoWidth = props.type === CoolmoveCode.TYPE.PRIMARY ? 60 : 200;
    const photoHeight = props.type === CoolmoveCode.TYPE.PRIMARY ? 60 : 240;
    const photoBorderRadius = props.type === CoolmoveCode.TYPE.PRIMARY ? 999 : 4;

    const [candidateItem, setCandidateItem] = useState<DtoCandidateItem | undefined>(emptyCandidateItem);
    useEffect(() => {
        setCandidateItem(props.candidateItem ?? emptyCandidateItem);
    }, [props.candidateItem]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClubNmChange = (value: string) => {
        if (candidateItem) {
            setCandidateItem({ ...candidateItem, clubNm: value });
            if (props.onCandidateItemChange) {
                props.onCandidateItemChange({ ...candidateItem, clubNm: value });
            }
        }
    };

    const handlePlayerNmChange = (value: string) => {
        if (candidateItem) {
            setCandidateItem({ ...candidateItem, playerNm: value });
            if (props.onCandidateItemChange) {
                props.onCandidateItemChange({ ...candidateItem, playerNm: value });
            }
        }
    };

    const handlePhotoUpload = () => {
        if (props.onPhotoUpload) {
            props.onPhotoUpload();
        } else {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                fileInputRef.current.click();
            }
        }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCandidateItem(prev => {
                    const next = prev ? { ...prev, photoFile: file } : { ...emptyCandidateItem, photoFile: file };
                    if (props.onCandidateItemChange) {
                        props.onCandidateItemChange(next);
                    }
                    return next;
                });
            };
            reader.onerror = (e) => {
                console.error('FileReader Error:', e);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#EFF9FF', padding: 1, gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ width: `${playerHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>소속</Box>
                <Box sx={{ width: '100%' }}>
                    <input
                        disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                        type="text"
                        placeholder={`${playerNameMaxLength}자 이내`}
                        maxLength={playerNameMaxLength}
                        value={candidateItem?.clubNm}
                        onChange={(e) => handleClubNmChange(e.target.value)}
                        style={{ width: '100%', minWidth: '150px' }}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ width: `${playerHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>이름</Box>
                <Box sx={{ width: '100%' }}>
                    <input
                        disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                        type="text"
                        placeholder={`${playerNameMaxLength}자 이내`}
                        maxLength={playerNameMaxLength}
                        value={candidateItem?.playerNm}
                        onChange={(e) => handlePlayerNmChange(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ width: `${playerHeadWidth}px`, marginRight: 1, marginTop: 1, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>사진</Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
                    {props.status !== CoolmoveCode.STATUS.DRAFT && (
                        <>
                            <img src={
                                candidateItem?.photoFile && candidateItem.photoFile instanceof File
                                    ? URL.createObjectURL(candidateItem.photoFile)
                                    : candidateItem?.photoPathNm && candidateItem.photoPathNm.trim() !== ''
                                        ? imgServer + candidateItem.photoPathNm
                                        : defaultUserImg
                            }
                                alt="Candidate"
                                style={{
                                    width: `${photoWidth}px`,
                                    height: `${photoHeight}px`,
                                    borderRadius: `${photoBorderRadius}px`,
                                    objectFit: 'cover',
                                    border: '1px solid #D1D5DB'
                                }}
                            />
                        </>
                    )}
                    {props.status === CoolmoveCode.STATUS.DRAFT && (
                        <>
                            <button
                                type="button"
                                onClick={handlePhotoUpload}
                                title={`후보자 사진 업로드`}
                                aria-label={`후보자 사진 업로드`}
                                style={{
                                    backgroundImage:
                                        candidateItem?.photoFile && candidateItem.photoFile instanceof File
                                            ? `url(${URL.createObjectURL(candidateItem.photoFile)})`
                                            : candidateItem?.photoPathNm && candidateItem.photoPathNm.trim() !== ''
                                                ? `url(${imgServer}${candidateItem.photoPathNm})`
                                                : `url(${defaultUserImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: `${photoWidth}px`,
                                    height: `${photoHeight}px`,
                                    borderRadius: `${photoBorderRadius}px`,
                                    border: '1px solid #D1D5DB'
                                }}
                            >
                                {candidateItem?.photoPathNm === defaultUserImg ? '사진 업로드' : ''}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoChange}
                                aria-label={`후보자 ${candidateItem?.id} 사진 업로드`}
                            />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
