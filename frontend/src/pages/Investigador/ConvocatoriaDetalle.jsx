import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Card, Spinner, Alert, Row, Col, ListGroup} from 'react-bootstrap';

export default function ConvocatoriaDetalle() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/call/${id}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || 'Error fetching convocatoria');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="max-w-xl mx-auto text-center">
      <NavBar />
      <div style={{ paddingTop: '40px', paddingBottom: '40px' }} className="container">
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && (
          <Alert variant="danger">Error cargando convocatoria: {error}</Alert>
        )}

        {data && (
          <Card style={{ textAlign: 'left' }}>
            <Card.Body>
              <Row>
                <Col>
                  <h3>{data.callN || data.callName || `Convocatoria ${id}`}</h3>
                </Col>
                <Col className="text-end">
                  <small className="text-muted">ID: {data.id}</small>
                </Col>
              </Row>

              <ListGroup variant="flush" className="mt-3">
                <ListGroup.Item>
                  <Row>
                    <Col sm={3}><strong>RFC</strong></Col>
                    <Col>{data.rfcCall || data.rfc || '-'}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col sm={3}><strong>Nombre</strong></Col>
                    <Col>{data.callN || data.nombre || '-'}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col sm={3}><strong>Inicio</strong></Col>
                    <Col>{formatDate(data.callBegin)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col sm={3}><strong>Fin</strong></Col>
                    <Col>{formatDate(data.callEnd)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col sm={3}><strong>Descripción</strong></Col>
                    <Col style={{ whiteSpace: 'pre-wrap' }}>{data.callDesc || data.descripcion || '-'}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              <div className="mt-3">
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}

function formatDate(value){
  if(!value) return '-';
  // try to parse YYYY-MM-DD or ISO
  try{
    const d = new Date(value);
    if(isNaN(d)) return value;
    return d.toLocaleDateString();
  }catch(e){
    return value;
  }
}