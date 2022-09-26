import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import cl from './Dropdown.module.css'
import PostService from '../../../API/PostService';
import MyButton from '../button/MyButton';
import { RefetchContext, RecContext } from '../../../context';


function DropdownMenu({props, p_id, setProps}) {

    const { setIsRec } = useContext(RecContext)

    const arr = [];
    console.log(props)

    function DropdownItem({pres_id, prop, props}) {

        const { setRefetch } = useContext(RefetchContext)
        const navigate = useNavigate()

        const getCamData = async() => {
            // This func also turns on recording and sends you
            // cam_id_page that moveset must be changed
            const response = await PostService.getProps(prop)
            
            if (response.status === 200) {
                const state = {
                    id: response.data.data.id,
                    loc: response.data.data.location,
                    status: response.data.data.status,
                    name: response.data.data.name,
                    ip: response.data.data.ip_address
                }
                
                const resp = await PostService.movesetString(pres_id)
                if (resp.status === 200) {
                    sessionStorage.setItem('p_name', resp.data.p_name)
                    sessionStorage.setItem('moveset', resp.data.moveset)
                    setIsRec(true)
                    navigate("/dashboard/" + prop, {state})
                }
            } else {
                console.log(response)
            }
        }

        const RewriteCamMoves = async () => {
            let ar = []

            props.map((p) => 
                {
                    if (p.content[0] === prop){
                        ar.push(p)
                    }
                })
            
            ar = props.filter((p) => {return !ar.includes(p)})
            // setProps({moveset: ar.content, p_id: ar.id})
            console.log(ar)
            const response = await PostService.rewritePreset(pres_id, ar)
            console.log(response)

            if (response.status === 200) {
                setRefetch(true)
                getCamData()
            } else if (response.status === 401) {
                setRefetch(true)
                console.log(response)
            } else {
                console.log(response) 
            }
        }

        return (
            <div className={cl.menu_item}>
                {prop} 
                <button className={cl.delete_move_btn} onClick={() => RewriteCamMoves()}>
                    R
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
            const response1 = await PostService.movesetString(p_id)
            if (response1.status === 200) {
                sessionStorage.setItem('p_name', response1.data.p_name)
                sessionStorage.setItem('moveset', response1.data.moveset)
            }
          } else {
            console.error(response)
          }
        } catch (e) {
          console.error(e)
        }
    }

    if (props.length > 0) {
        props.map(prop => arr.includes(prop.content[0]) ? console.log('no') : arr.push(prop.content[0]))
    }

    console.log(arr)

    return (
        <div className={cl.dropdown}>
            <div className={cl.camerasInvolved}>
                <p>Cameras Involved</p>
            </div>
            <div className={cl.drop_content}>
                {props.length > 0 &&
                // props.map((prop) => <DropdownItem key={prop.id} prop={prop.content} p_id={p_id} m_id={prop.id}
                //     count={props.length}/>) 
                    arr.map((val, id) => <DropdownItem key={id} prop={val} pres_id={p_id} props={props}/>)
                }
            </div>
            <div className={cl.dropdown_button}>
                {props.length > 0 &&
                        <MyButton onClick={() => addMoves(p_id)}>Add Camera</MyButton>
                }
            </div>
        </div>
        
    )
}

export default DropdownMenu;