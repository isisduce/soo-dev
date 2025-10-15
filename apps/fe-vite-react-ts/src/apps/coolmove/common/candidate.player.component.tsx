import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAppEnvStore } from '../../../appmain/app.env';
import defaultUserImg from '/styles/images/user-img-120.png';
import { emptyCandidateItem, type DtoCandidateItem } from '../dto/dto.candidate';

interface CandidatePlayerComponentProps {
    candidate?: DtoCandidateItem;
    onCandidateChange?: (candidate: DtoCandidateItem) => void;
    onPhotoUpload?: () => void;
    }

export const CandidatePlayerComponent: React.FC<CandidatePlayerComponentProps> = (props: CandidatePlayerComponentProps) => {

    const env = useAppEnvStore((state) => state.env);
    const imgServer = env.apps?.urlImgServer || '';

    const [candidate, setCandidate] = useState<DtoCandidateItem | undefined>(emptyCandidateItem);
    useEffect(() => {
        setCandidate(props.candidate ?? emptyCandidateItem);
    }, [props.candidate]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClubNmChange = (value: string) => {
        if (candidate) {
            setCandidate({ ...candidate, clubNm: value });
            if (props.onCandidateChange) {
                props.onCandidateChange({ ...candidate, clubNm: value });
            }
        }
    };

    const handlePlayerNmChange = (value: string) => {
        if (candidate) {
            setCandidate({ ...candidate, playerNm: value });
            if (props.onCandidateChange) {
                props.onCandidateChange({ ...candidate, playerNm: value });
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
                setCandidate(prev => {
                    const next = prev ? { ...prev, photoFile: file } : { ...emptyCandidateItem, photoFile: file };
                    if (props.onCandidateChange) {
                        props.onCandidateChange(next);
                    }
                    return next;
                });
            };
            reader.onerror = (e) => {
                console.error('FileReader 에러:', e);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Box sx={{ width: '30px', whiteSpace: 'nowrap' }}>소속</Box>
                    <Box sx={{ width: '100%' }}>
                        <input
                            type="text"
                            placeholder="20자 이내"
                            maxLength={20}
                            value={candidate?.clubNm ?? ""}
                            onChange={(e) => handleClubNmChange(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Box sx={{ width: '30px', whiteSpace: 'nowrap' }}>이름</Box>
                    <Box sx={{ width: '100%' }}>
                        <input
                            type="text"
                            placeholder="20자 이내"
                            maxLength={20}
                            value={candidate?.playerNm ?? ""}
                            onChange={(e) => handlePlayerNmChange(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Box sx={{ width: '30px', marginTop: 1, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>사진</Box>
                    <Box sx={{ width: '100%' }}>
                        <button
                            type="button"
                            onClick={handlePhotoUpload}
                            title={`후보자 사진 업로드`}
                            aria-label={`후보자 사진 업로드`}
                            style={{
                                backgroundImage:
                                    candidate?.photoFile && candidate.photoFile instanceof File
                                        ? `url(${URL.createObjectURL(candidate.photoFile)})`
                                        : candidate?.photoPathNm && candidate.photoPathNm.trim() !== ''
                                            ? `url(${imgServer}${candidate.photoPathNm})`
                                            : `url(${defaultUserImg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '200px',
                                height: '240px',
                                borderRadius: '4px',
                                border: '1px solid #D1D5DB'
                            }}
                        >
                            {candidate?.photoPathNm === defaultUserImg ? '사진 업로드' : ''}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePhotoChange}
                            aria-label={`후보자 ${candidate?.id} 사진 업로드`}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
