import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import defaultUserImg from '/styles/images/user-img-120.png';
import { CoolmoveCode, type CoolmoveStatus, type CoolmoveType } from '../types/types';
import { type DtoCandidateItem } from '../dto/dto.candidate';

interface CandidatePlayerProps {
    type?: CoolmoveType;
    status?: CoolmoveStatus;
    candidateItem?: DtoCandidateItem;
    setCandidateItem?: (candidateItem: DtoCandidateItem) => void;
}

export const CandidatePlayer: React.FC<CandidatePlayerProps> = (props: CandidatePlayerProps) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const playerHeadWidth = 40;
    const playerNameMaxLength = 10;
    const photoWidth = props.type === CoolmoveCode.TYPE.PRIMARY ? 60 : 200;
    const photoHeight = props.type === CoolmoveCode.TYPE.PRIMARY ? 60 : 240;
    const photoBorderRadius = props.type === CoolmoveCode.TYPE.PRIMARY ? 999 : 4;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClubNmChange = (value: string) => {
        if (props.setCandidateItem && props.candidateItem) {
            props.setCandidateItem({ ...props.candidateItem, clubNm: value });
        }
    };

    const handlePlayerNmChange = (value: string) => {
        if (props.setCandidateItem && props.candidateItem) {
            props.setCandidateItem({ ...props.candidateItem, playerNm: value });
        }
    };

    const handlePhotoUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (props.setCandidateItem && props.candidateItem) {
                    props.setCandidateItem({ ...props.candidateItem, photoFile: file });
                }
            };
            reader.onerror = (e) => {
                console.error('FileReader Error:', e);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#EFF9FF', padding: 2, gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ width: `${playerHeadWidth}px`, marginRight: 1, whiteSpace: 'nowrap' }}>소속</Box>
                <Box sx={{ width: '100%' }}>
                    <input
                        disabled={props.status !== CoolmoveCode.STATUS.DRAFT}
                        type="text"
                        placeholder={`${playerNameMaxLength}자 이내`}
                        maxLength={playerNameMaxLength}
                        value={props.candidateItem?.clubNm ?? ''}
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
                        value={props.candidateItem?.playerNm ?? ''}
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
                                props.candidateItem?.photoFile && props.candidateItem.photoFile instanceof File
                                    ? URL.createObjectURL(props.candidateItem.photoFile)
                                    : props.candidateItem?.photoPathNm && props.candidateItem.photoPathNm.trim() !== ''
                                        ? imgServer + props.candidateItem.photoPathNm
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
                                        props.candidateItem?.photoFile && props.candidateItem.photoFile instanceof File
                                            ? `url(${URL.createObjectURL(props.candidateItem.photoFile)})`
                                            : props.candidateItem?.photoPathNm && props.candidateItem.photoPathNm.trim() !== ''
                                                ? `url(${imgServer}${props.candidateItem.photoPathNm})`
                                                : `url(${defaultUserImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: `${photoWidth}px`,
                                    height: `${photoHeight}px`,
                                    borderRadius: `${photoBorderRadius}px`,
                                    border: '1px solid #D1D5DB'
                                }}
                            >
                                {props.candidateItem?.photoPathNm === defaultUserImg ? '사진 업로드' : ''}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoChange}
                                aria-label={`후보자 ${props.candidateItem?.id} 사진 업로드`}
                            />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
