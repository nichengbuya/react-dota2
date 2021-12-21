import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import {range, inRange} from 'lodash';
import Draggable from './Draggable';

const MAX = 5;
const HEIGHT = 80;

const DragList = () => {
  const items = range(MAX);
  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null
  });
    
  const handleDrag = useCallback(({translation, id}) => {
    const delta = Math.round(translation.y / HEIGHT);
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter((index: any) => index !== id);
        
    if (!inRange(index + delta, 0, items.length)) {
      return;
    }
        
    dragOrder.splice(index + delta, 0, id);
        
    setState(state => ({
      ...state,
      draggedIndex: id,
      dragOrder
    }));
  }, [state.order, items.length]);
    
  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);
    
  return (
    <Container>
      {items.map((index: any) => {
        const isDragging = state.draggedIndex === index;
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
        const offset = isDragging?draggedTop:top; 
        return (
          <Draggable
            key={index}
            id={index}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div style={{
               width:`300px`,
               height:`${HEIGHT}px`,
               backgroundColor:'#ccc',
               position:`absolute` ,
                top:`${isDragging?draggedTop : top}px`,
                transition: `${isDragging ? 'none' : 'all 500ms'}`
            }}>
              {index}
            </div>

          </Draggable>
        );
      })}
    </Container>
  );
};

export default DragList;

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
`;

