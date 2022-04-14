import React, { createRef, RefObject, useEffect, useState } from 'react';

import { Image, View } from 'react-native';

import { MomentTagType, ProfilePreviewType } from 'types';

import TaggDraggable from '../taggs/TaggDraggable';
import Draggable from './Draggable';

interface MomentTagsProps {
  editing: boolean;
  tags: MomentTagType[];
  setTags: (tag: MomentTagType[]) => void;
  imageRef: RefObject<Image>;
  deleteFromList?: (user: ProfilePreviewType) => void;
  boundaries?: DraggableBoundaries;
}
interface DraggableBoundaries {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

const MomentTags: React.FC<MomentTagsProps> = ({
  editing,
  tags,
  setTags,
  imageRef,
  deleteFromList,
  boundaries,
}) => {
  const [offset, setOffset] = useState([0, 0]);
  const [imageDimensions, setImageDimensions] = useState([0, 0]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [draggableRefs, setDraggableRefs] = useState<RefObject<View>[]>([]);
  // [minXBoundary, maxXBoundary, minYBoundary, maxYBoundary]
  const [boundariesList, setBoundariesList] = useState<number[]>([0, 0, 0, 0]);

  const updateTagPosition = (ref: RefObject<Image>, userId: string) => {
    if (ref !== null && ref.current !== null) {
      ref.current.measure(
        (
          _fx: number, // location of ref relative to parent element
          _fy: number,
          _width: number,
          _height: number,
          px: number, // location of ref relative to entire screen
          py: number,
        ) => {
          const x = ((px - offset[0]) / imageDimensions[0]) * 100;
          const y = ((py - offset[1]) / imageDimensions[1]) * 100;
          setTags(
            tags.map(tag =>
              tag.user.id === userId
                ? {
                    id: '',
                    x,
                    y,
                    z: maxZIndex - 1, // TODO: change this
                    user: tag.user,
                  }
                : tag,
            ),
          );
        },
      );
    }
  };

  useEffect(() => {
    setDraggableRefs(tags.map(_ => createRef()));
  }, [tags]);

  useEffect(() => {
    setTimeout(
      () => {
        if (imageRef && imageRef.current) {
          imageRef.current.measure(
            (
              fx: number, // location of ref relative to parent element
              fy: number,
              width: number,
              height: number,
              _x: number, // location of ref relative to entire screen
              _y: number,
            ) => {
              setOffset([fx, fy]);
              setImageDimensions([width, height]);
            },
          );
        }

        // Checks for and adds boundaries
        if (boundaries) {
          const newBounds = [...boundariesList];
          if (boundaries.top) {
            newBounds[2] = boundaries.top;
          }
          if (boundaries.bottom) {
            newBounds[3] = boundaries.bottom;
          }
          if (boundaries.left) {
            newBounds[0] = boundaries.left;
          }
          if (boundaries.right) {
            newBounds[1] = boundaries.right;
          }
          setBoundariesList(newBounds);
        }
      },
      editing ? 100 : 0,
    );
  }, []);

  if (!tags) {
    return null;
  }

  return editing && deleteFromList ? (
    <>
      {tags.map((tag, index) => (
        <Draggable
          key={tag.user.id + tag.x + tag.y}
          x={(imageDimensions[0] * tag.x) / 100 + offset[0]}
          y={(imageDimensions[1] * tag.y) / 100 + offset[1]}
          z={tag.z}
          minX={offset[0] + boundariesList[0]}
          minY={offset[1] + boundariesList[2]}
          maxX={imageDimensions[0] + offset[0] - boundariesList[1]}
          maxY={imageDimensions[1] + offset[1] - boundariesList[3]}
          onDragStart={() => {
            const currZIndex = maxZIndex;
            setMaxZIndex(currZIndex + 1);
            return currZIndex;
          }}
          onDragRelease={() => updateTagPosition(draggableRefs[index], tag.user.id)}>
          <TaggDraggable
            draggableRef={draggableRefs[index]}
            taggedUser={tag.user}
            editingView={true}
            deleteFromList={() => deleteFromList(tag.user)}
          />
        </Draggable>
      ))}
    </>
  ) : (
    <>
      {tags.map((tag, index) => (
        <Draggable
          key={tag.user.id}
          x={(imageDimensions[0] * tag.x) / 100 + offset[0]}
          y={(imageDimensions[1] * tag.y) / 100 + offset[1]}
          z={tag.z}
          minX={offset[0] + boundariesList[0]}
          minY={offset[1] + boundariesList[2]}
          maxX={imageDimensions[0] + offset[0] - boundariesList[1]}
          maxY={imageDimensions[1] + offset[1] - boundariesList[3]}
          disabled={true}>
          <TaggDraggable
            draggableRef={draggableRefs[index]}
            taggedUser={tag.user}
            editingView={editing}
            deleteFromList={() => null}
          />
        </Draggable>
      ))}
    </>
  );
};

export default MomentTags;
