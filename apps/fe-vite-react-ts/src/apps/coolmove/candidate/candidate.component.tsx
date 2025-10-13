
import React, { useState } from 'react';
import { CandidateItemComponent } from './candidate-item.component';
import { emptyCandidateItem, type DtoCandidateItem } from '../dto/dto.candidate';

export const CandidateComponent: React.FC = () => {
    const [candidate1, setCandidate1] = useState<DtoCandidateItem>(emptyCandidateItem);
    const [candidate2, setCandidate2] = useState<DtoCandidateItem>(emptyCandidateItem);

    const handleSubmit = () => {
        // 후보자 정보 제출 로직
        console.log('후보자 1:', candidate1);
        console.log('후보자 2:', candidate2);
    };

    return (
        <div className="candidate-cont">
            <CandidateItemComponent
                candidate={candidate1}
                onCandidateChange={setCandidate1}
            />

            <CandidateItemComponent
                candidate={candidate2}
                onCandidateChange={setCandidate2}
            />

            {/* 제출 버튼 */}
            <div className="candidate-submit">
                <button type="button" className="btn primary" onClick={handleSubmit}>
                    후보자 등록
                </button>
            </div>
        </div>
    );
};