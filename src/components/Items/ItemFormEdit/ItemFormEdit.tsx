import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { URL_SERVER } from "../../../const/index";
import { useAppDispatch, useAppSelector } from "../../../hooks/index";
import { updateFile } from "../../../redux/slices/diskSlice";
import { clearModal, runModal } from "../../../redux/slices/modalSlice";
import { baseFetch } from "../../../utils/index";
import './itemFormEdit.css';

const initialState = {
  title: '',
  comment: '',
  checked: true,
}

export const ItemFormEdit = () => {
  const [statePage, setStatePage] = useState(initialState); // создание локального хранилища
  const { currentFile } = useAppSelector((state) => state.disk); // получение данных из глобального хранилища
  const dispatch = useAppDispatch(); // dispatch это словно диспетчер - он доставляет action для нашего редьюсера
  
  const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Обрабатываем изменение в поле input
    const { name, value } = event.target;
    setStatePage({ ...statePage, [name]: value });
  }

  const handleClick = () => {
    // Нажатие кнопки отмена
    dispatch(clearModal());
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    // Отправка формы редактирования файла (событие Submit) 
    event.preventDefault();
    dispatch(clearModal());
    const formData = new FormData(event.target);
    let title = currentFile.title.match(/\.[^.]+$/i)[0];
    title = `${formData.get('title')}${title}`;
    formData.set('title', title)
    console.log('title', formData.get('title'))
    try {
      const response = await baseFetch({ url: `${URL_SERVER}/file/${currentFile.id}/`, method: "PATCH", body: formData });
      console.log('успех', response)
      dispatch(updateFile(response));
      // dispatch(succesAuth(response));
      // dispatch(setAuthTrue());
      // console.log('успех')
    } catch (e: any) {
      dispatch(runModal({ type: 'error', message: e.message }));
    }
  }

  if (statePage.checked) {
    setStatePage({ 
      ...statePage,
      ['title']: currentFile.title.replace(/^([^.]+)$|(\.[^.]+)$/i, '$1'),
      ['comment']: currentFile.comment,
      ['checked']: false,
    });
  }

  return (
    <form className="form__edit__file" onSubmit={handleSubmit}>
      <div className="content__file">
        <div className="file__title">
          <span>Имя файла: </span>
          <input type="text" value={statePage.title} className="file__title__input" name="title" onChange={changeInput} />
        </div>
        <div className="file__comment">
          <span>Комментарий: </span>
          <textarea type="text" value={statePage.comment} className="file__comment__input" name="comment" onChange={changeInput} rows="8" />
        </div>
      </div>
      <div className="content__controll">
        <button type="submit" className="content__link">Сохранить</button>
        <Link to={'#'} className="content__link" onClick={handleClick} name="return">Отмена</Link>
      </div>
    </form>
  )
}