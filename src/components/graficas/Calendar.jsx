import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from "../Navbar";
import Aside from "../Aside";
import Footer from "../Footer";
const ReservasCalendario = () => {
  // Referencia al calendario
  const calendarRef = useRef(null);
  // Referencia a eventos externos (ej. salones disponibles)
  const externalEventsRef = useRef([
    { title: 'Sala de Conferencias', backgroundColor: '#28a745', borderColor: '#28a745', textColor: '#fff' },
    { title: 'Espacio de Reuniones', backgroundColor: '#ffc107', borderColor: '#ffc107', textColor: '#fff' },
    { title: 'Salón de Eventos', backgroundColor: '#007bff', borderColor: '#007bff', textColor: '#fff' },
    // ... (otros espacios disponibles)
  ]);
  // Referencia al input para agregar nuevas reservas
  const newEventInputRef = useRef(null);

  useEffect(() => {
    const initExternalEvents = () => {
      const calendarApi = calendarRef.current.getApi();
  
      externalEventsRef.current.forEach((externalEvent) => {
        calendarApi.addEvent(externalEvent);
      });
  
      calendarApi.addEventSource({
        events: externalEventsRef.current,
      });
  
      calendarApi.render();
    };
  
    initExternalEvents();
  }, []);

  const handleColorChooserClick = (e) => {
    e.preventDefault();
    const currColor = e.target.style.color;

    document.getElementById('add-new-event').style.backgroundColor = currColor;
    document.getElementById('add-new-event').style.borderColor = currColor;
  };

  const handleAddEventClick = () => {
    const newEventInputValue = newEventInputRef.current.value;

    if (newEventInputValue.length === 0) {
      return;
    }

    const event = {
      title: newEventInputValue,
      backgroundColor: document.getElementById('add-new-event').style.backgroundColor,
      borderColor: document.getElementById('add-new-event').style.borderColor,
      textColor: '#fff',
    };

    calendarRef.current.getApi().addEvent(event);
    newEventInputRef.current.value = '';
  };

  // Eventos predefinidos para mostrar reservaciones por hora
  const predefinidos = [
    { title: 'Reunión 1', start: '2023-12-01T09:00:00', end: '2023-01-01T10:00:00', backgroundColor: '#ff4500', borderColor: '#ff4500', textColor: '#fff' },
    { title: 'Reunión 2', start: '2023-12-02T10:30:00', end: '2023-01-01T11:30:00', backgroundColor: '#008080', borderColor: '#008080', textColor: '#fff' },
    { title: 'Almuerzo', start: '2023-12-05T12:00:00', end: '2023-01-01T13:00:00', backgroundColor: '#32cd32', borderColor: '#32cd32', textColor: '#fff' },
    { title: 'Presentación', start: '2023-12-05T14:00:00', end: '2023-01-01T15:00:00', backgroundColor: '#9932cc', borderColor: '#9932cc', textColor: '#fff' },
    { title: 'Entrevista', start: '2023-12-08T15:30:00', end: '2023-01-01T16:30:00', backgroundColor: '#8b0000', borderColor: '#8b0000', textColor: '#fff' },
    { title: 'Conferencia', start: '2023-12-10T17:00:00', end: '2023-01-01T18:00:00', backgroundColor: '#ffd700', borderColor: '#ffd700', textColor: '#fff' },
    { title: 'Evento Social', start: '2023-12-15T18:30:00', end: '2023-01-01T19:30:00', backgroundColor: '#ffa07a', borderColor: '#ffa07a', textColor: '#fff' },
    { title: 'Capacitación', start: '2023-12-24T20:00:00', end: '2023-01-01T21:00:00', backgroundColor: '#4682b4', borderColor: '#4682b4', textColor: '#fff' },
    { title: 'Reunión 3', start: '2023-12-24T21:30:00', end: '2023-01-01T22:30:00', backgroundColor: '#00ced1', borderColor: '#00ced1', textColor: '#fff' },
    { title: 'Taller', start: '2023-12-24T23:00:00', end: '2023-01-02T00:00:00', backgroundColor: '#ff6347', borderColor: '#ff6347', textColor: '#fff' },
  ];

  return (
    <div className="wrapper">
    <Navbar />
    <Aside />
    <div className="content-wrapper">
      {/* Encabezado de la página */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Calendario de Reservas</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Calendario de Reservas</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      {/* Contenido principal */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Columna izquierda */}
            <div className="col-md-3">
              <div className="sticky-top mb-3">
                {/* Carta de eventos externos */}
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Espacios Disponibles</h4>
                  </div>
                  <div className="card-body">
                    <div id="external-events">
                      {externalEventsRef.current.map((externalEvent, index) => (
                        <div
                          key={index}
                          className="external-event"
                          style={{
                            backgroundColor: externalEvent.backgroundColor,
                            borderColor: externalEvent.borderColor,
                            color: externalEvent.textColor,
                          }}
                        >
                          {externalEvent.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Carta de nueva reserva */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Hacer una Reserva</h3>
                  </div>
                  <div className="card-body">
                    <div className="btn-group" style={{ width: '100%', marginBottom: '10px' }}>
                      <ul className="fc-color-picker" id="color-chooser">
                        {/* Opciones de colores para la reserva */}
                        <li><a className="text-success" href="#" onClick={handleColorChooserClick}><i className="fas fa-square"></i></a></li>
                        <li><a className="text-warning" href="#" onClick={handleColorChooserClick}><i className="fas fa-square"></i></a></li>
                        <li><a className="text-primary" href="#" onClick={handleColorChooserClick}><i className="fas fa-square"></i></a></li>
                        {/* ... (otros colores) ... */}
                      </ul>
                    </div>
                    <div className="input-group">
                      <input id="new-event" type="text" className="form-control" placeholder="Título de la Reserva" ref={newEventInputRef} />
                      <div className="input-group-append">
                        <button id="add-new-event" type="button" className="btn btn-primary" onClick={handleAddEventClick}>Reservar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Columna derecha */}
            <div className="col-md-9">
              {/* Carta principal con el calendario */}
              <div className="card card-primary">
                <div className="card-body p-0">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    ref={calendarRef}
                    initialView="dayGridMonth"
                    events={predefinidos}
                    editable={true}
                    droppable={true}
                    eventReceive={(info) => {
                      // Manejar el evento después de soltarlo
                      // info.event contiene la información del nuevo evento
                      console.log('Evento recibido:', info.event);

                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      </div>
            <Footer />
        </div>
  );
};

export default ReservasCalendario;
