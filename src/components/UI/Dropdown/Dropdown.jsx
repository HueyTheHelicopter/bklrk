import React, { useContext } from 'react';
import cl from './Dropdown.module.css'
import PostService from '../../../API/PostService';
import MyButton from '../button/MyButton';
import { RefetchContext, RecContext } from '../../../context';


function DropdownMenu({props, p_id}) {

    const { setIsRec } = useContext(RecContext)

    function DropdownItem({m_id, p_id, prop, count}) {

        const { setRefetch } = useContext(RefetchContext)

        const delOneMove = async () => {
            if (count > 1){
                console.log(m_id)
                console.log(p_id)
                const response = await PostService.delOneMove(p_id, m_id)
            
                response.status === 200 ?
                    setRefetch(true)
                : console.log(response)
            } else { alert ("can't delete last move") }
        }
        
        return (
            <div className={cl.menu_item}>
                {prop} 
                <button className={cl.delete_move_btn} onClick={() => delOneMove()}>
                    x
                </button>
            </div>
        )
    }

    const addMoves = async (p_id) => {
        try{
          // set cams to home, get response, if status 200 -> do evrthng what's below
          const response = await PostService.allCamsHome()
          if (response.status === 200){
            setIsRec(true)
            const response = await PostService.movesetString(p_id)
            sessionStorage.setItem('p_name', response.data.p_name)
            sessionStorage.setItem('moveset', response.data.moveset)
          } else {
            console.error(response)
          }
        } catch (e) {
          console.error(e)
        }
    }

    return (
        <div className={cl.dropdown}>
            <div className={cl.drop_content}>
                {props.length > 0 &&
                props.map((prop) => <DropdownItem key={prop.id} prop={prop.content} p_id={p_id} m_id={prop.id}
                    count={props.length}/>) 
                }
            </div>
            <div className={cl.dropdown_button}>
                {props.length > 0 &&
                        <MyButton onClick={() => addMoves(p_id)}>add more moves</MyButton>
                }
            </div>
        </div>
        
    )
}

export default DropdownMenu;