import React from 'react';
import { Box, Typography } from '@mui/material';
import { PathHelper } from '../helper/path.helper';

interface RenderPathTextProps {
    rootPath?: string;
    currentPath: string;
    setCurrentPath?: (path: string) => void;
    setSelectedFiles?: (file: any[]) => void;
    availableWidth: number;
}

// 경로를 텍스트 형식으로 렌더링
export const RenderPathTextComponent: React.FC<RenderPathTextProps> = (props : RenderPathTextProps) => {

    const { rootPath, currentPath, setCurrentPath, setSelectedFiles, availableWidth } = props;

    if (!rootPath) {
        return <Typography variant="body2" color="error">Root path is not set.</Typography>;
    }
    if (!currentPath) {
        return <Typography variant="body2" color="error">Current path is not set.</Typography>;
    }

    const normalizedPath = PathHelper.normalizePath(currentPath);
    const parts = PathHelper.splitPath(normalizedPath);
    const rootParts = PathHelper.splitPath(rootPath);

    const pathElements = [];

    const handlePathClick = (targetPath: string) => {
        const normalizedPath = PathHelper.normalizePath(targetPath);
        setCurrentPath?.(normalizedPath);
        setSelectedFiles?.([]);
    };

    // 루트 텍스트 추가
    pathElements.push(
        <Typography
            key="root"
            variant="body2"
            component="span"
            sx={{
                cursor: 'pointer',
                color: normalizedPath === rootPath ? 'primary.main' : 'text.primary',
                fontWeight: normalizedPath === rootPath ? 'bold' : 'normal',
                '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                },
                px: 0.5,
                borderRadius: 0.5
            }}
            onClick={() => handlePathClick(rootPath)}
        >
            🏠
        </Typography>
    );

    // 텍스트 길이 계산을 위한 함수
    const calculateTextLength = (text: string) => {
        // 대략적인 문자 너비 계산 (영문: 8px, 한글: 16px, 이모지: 16px)
        let length = 0;
        for (let char of text) {
            if (/[\u3131-\uD79D]/.test(char)) { // 한글
                length += 12;
            } else if (/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]/u.test(char)) { // 이모지
                length += 14;
            } else { // 영문/숫자/기호
                length += 8;
            }
        }
        return length;
    };

    // 경로가 길 경우 생략 처리
    const remainingParts = parts.slice(rootParts.length);

    // 실제 다이얼로그 너비 기반 계산 (동적으로 측정된 값 사용)
    const homeTextLength = calculateTextLength('🏠') + 16; // 패딩 포함
    // const ellipsisLength = calculateTextLength('...') + 16; // 패딩 포함 (사용하지 않으므로 제거)
    const separatorLength = calculateTextLength('/') + 8; // 여백 포함

    if (remainingParts.length === 0) {
        // 루트 경로인 경우는 그대로 반환
        return (
            <Box display="flex" alignItems="center" gap={0} flexWrap="nowrap" sx={{ overflow: 'hidden' }}>
                {pathElements}
            </Box>
        );
    }

    // rootPath(🏠) 고정, 마지막 항목부터 역순으로 추가, 초과 시 ...으로 대체
    // let usedWidth = homeTextLength; // 사용하지 않으므로 제거
    const n = remainingParts.length;
    const reversed = [];
    let reachedLimit = false;
    let totalWidth = homeTextLength;
    // separator와 항목 길이 계산 함수
    const getItemWidth = (item: string) => calculateTextLength(item) + 16 + separatorLength;
    // 마지막부터 역순으로 추가
    for (let i = n - 1; i >= 0; i--) {
        const part = remainingParts[i];
        const partWidth = getItemWidth(part);
        if (i !== n - 1) totalWidth += separatorLength; // separator for all except last
        if (totalWidth + partWidth > availableWidth && reversed.length > 0) {
            reachedLimit = true;
            break;
        }
        reversed.unshift({ idx: i, part });
        totalWidth += partWidth;
    }
    // rootPath(🏠)는 항상 표시
    // ...existing code...
    // ... rootPath 표시 코드 ...
    // ...existing code...
    if (reachedLimit) {
        pathElements.push(
            <Typography key="separator-ellipsis" variant="body2" component="span" color="text.secondary" sx={{ mx: 0.5 }}>/</Typography>
        );
        pathElements.push(
            <Typography key="ellipsis" variant="body2" component="span" color="text.secondary" sx={{ px: 0.5 }}>...</Typography>
        );
    }
    // 역순으로 추가된 항목들 표시
    reversed.forEach(({ idx, part }) => {
        pathElements.push(
            <Typography key={`separator-${idx}`} variant="body2" component="span" color="text.secondary" sx={{ mx: 0.5 }}>/</Typography>
        );
        const pathUpToIndex = PathHelper.joinPath(parts.slice(0, rootParts.length + idx + 1));
        pathElements.push(
            <Typography
                key={pathUpToIndex}
                variant="body2"
                component="span"
                role="button"
                sx={{
                    color: idx === n - 1 ? 'primary.main' : 'text.primary',
                    fontWeight: idx === n - 1 ? 'bold' : 'normal',
                    '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                    },
                    px: 0.5,
                    borderRadius: 0.5
                }}
                onClick={() => handlePathClick(pathUpToIndex)}
            >
                {part}
            </Typography>
        );
    });

    return (
        <Box display="flex" alignItems="center" gap={0} flexWrap="nowrap" sx={{ overflow: 'hidden', }}>
            {pathElements}
        </Box>
    );
};
