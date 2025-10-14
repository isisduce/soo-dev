import React, { useEffect, useRef, useState } from 'react';
import { useAppEnvStore } from '../../../appmain/app.env';
import defaultUserImg from '/styles/images/user-img-120.png';
import dragHandle from '/styles/images/ico-list-24.svg';
import { emptyCandidateItem, type DtoCandidateItem } from '../dto/dto.candidate';

interface PrimaryPlayerComponentProps {
    candidate?: DtoCandidateItem;
    onCandidateChange?: (candidate: DtoCandidateItem) => void;
    onPhotoUpload?: () => void;
}

export const PrimaryPlayerComponent: React.FC<PrimaryPlayerComponentProps> = (props: PrimaryPlayerComponentProps) => {

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

    const handlePledgeChange = (index: number, value: string) => {
        const newPledges = candidate?.pledges?.map((pledge, i) =>
            i === index ? value : pledge
        );
        if (candidate) {
            setCandidate({ ...candidate, pledges: newPledges });
            if (props.onCandidateChange) {
                props.onCandidateChange({ ...candidate, pledges: newPledges });
            }
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
        const newPledges = candidate?.pledges ? [...candidate.pledges] : [];
        const [removed] = newPledges.splice(draggedIndex, 1);
        newPledges.splice(index, 0, removed);
        if (candidate) {
            setCandidate({ ...candidate, pledges: newPledges });
            if (props.onCandidateChange) {
                props.onCandidateChange({ ...candidate, pledges: newPledges });
            }
        }
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleImageUpload = () => {
        if (props.onPhotoUpload) {
            props.onPhotoUpload();
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                console.error('FileReader Error:', e);
            };
            reader.readAsDataURL(file);
        }
    };

    const getCharacterCount = (text: string): number => {
        return text.length;
    };

    return (
        <div className={`candidate-${candidate?.id === 1 ? '01' : '02'}`}>
            <div className="candidate-tit">후보자 {candidate?.id} 등록</div>
            <div className="candidate-input-group">
                <div className="flex-group">
                    <label>소속</label>
                    <input
                        type="text"
                        placeholder="20자 이내"
                        maxLength={20}
                        value={candidate?.clubNm}
                        onChange={(e) => handleClubNmChange(e.target.value)}
                    />
                </div>
                <div className="flex-group">
                    <label>이름</label>
                    <input
                        type="text"
                        placeholder="20자 이내"
                        maxLength={20}
                        value={candidate?.playerNm}
                        onChange={(e) => handlePlayerNmChange(e.target.value)}
                    />
                </div>
                <div className="flex-group">
                    <label>사진</label>
                    <button
                        type="button"
                        // className="candidate-upload-area"
                        onClick={handleImageUpload}
                        title={`후보자 ${candidate?.id} 사진 업로드`}
                        aria-label={`후보자 ${candidate?.id} 사진 업로드`}
                        style={{
                            backgroundImage:
                                candidate?.photoFile && candidate.photoFile instanceof File
                                    ? `url(${URL.createObjectURL(candidate.photoFile)})`
                                    : candidate?.photoPathNm && candidate.photoPathNm.trim() !== ''
                                        ? `url(${imgServer}${candidate.photoPathNm})`
                                        : `url(${defaultUserImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '60px',
                            height: '60px',
                            borderRadius: '999px',
                            border: '1px solid #D1D5DB',
                        }}
                    >
                        {candidate?.photoPathNm === defaultUserImg ? '사진 업로드' : ''}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        aria-label={`후보자 ${candidate?.id} 사진 업로드`}
                    />
                </div>
                <div className={`promise-input-area promise-input-area${candidate?.id === 1 ? '01' : '02'}`}>
                    <label>공약 입력 (최대 5개, 드래그로 순서 변경)</label>
                    {candidate?.pledges?.map((pledge, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            onDragEnd={handleDragEnd}
                            style={{
                                opacity: draggedIndex === index ? 0.5 : 1,
                                border: draggedIndex === index ? '1px dashed #888' : undefined,
                                cursor: 'move',
                                marginBottom: 8
                            }}
                        >
                            <div>
                                <textarea
                                    maxLength={40}
                                    placeholder="공약을 40자 이내로 입력해 주세요."
                                    value={pledge}
                                    onChange={(e) => handlePledgeChange(index, e.target.value)}
                                />
                                <span>
                                    <em>{getCharacterCount(pledge)}</em>/40
                                </span>
                            </div>
                            <span style={{fontSize:12, color:'#888'}}><img src={dragHandle} alt="드래그 핸들" /></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};