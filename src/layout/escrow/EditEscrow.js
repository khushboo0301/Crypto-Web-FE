import React, { useEffect, useRef, useState } from "react";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";
import { useDispatch } from "react-redux";
import jwtAxios from "../../service/jwtAxios";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";

export const EditEscrowView = (props) => {
  const [step, setStep] = useState(1);
  const escrowLinkRef = useRef(null);
  const [escrowType, setEscrowType] = useState(null);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [description, setDescription] = useState(null);
  const [escrowNumber, setEscrowNumber] = useState(null);
  const [escrows, setEscrow] = useState(null);
  const acAddress = useSelector(userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [object, setObject] = useState("");
  const [showObjects, setShowObject] = useState(false);
  const objects = [{ value: "Jewlery", label: "Jewlery" }];
  const [category, setCategory] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const categories = [{ value: "high_value_items", label: "High-value items" }];
  const [processTime, setProcessTime] = useState("");
  const [showProcessTime, setShowProcessTime] = useState(false);
  const processTimes = [{ value: "24 Hours", label: "24 Hours" }];
  const countryDropdownRef = useRef(null);
  const optionsDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  const handleNext = () => {
    if (step === 1) {
      if (priceType == "") {
        dispatch(notificationFail("Please add Fixed or Flexible Price"));
      } else {
        if (priceType == "fixed") {
          if (!price || price == "") {
            dispatch(notificationFail("Please add Fixed Price"));
          } else {
            setStep(step + 1);
          }
        } else if (priceType == "flexible") {
          if (!minPrice || minPrice == "") {
            dispatch(notificationFail("Please add Flexible Minimum Price"));
          } else if (!maxPrice || maxPrice == "") {
            dispatch(notificationFail("Please add Flexible Maximum Price"));
          } else {
            setStep(step + 1);
          }
        }
      }
    } else {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleGlobalClick = (event) => {
    // Close dropdowns if the click is outside of them
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target) &&
      optionsDropdownRef.current &&
      !optionsDropdownRef.current.contains(event.target) &&
      locationDropdownRef.current &&
      !locationDropdownRef.current.contains(event.target)
    ) {
      setShowObject(false);
      setShowProcessTime(false);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    // Add global click event listener
    document.addEventListener("click", handleGlobalClick);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const inputChangeHandler = (e) => {
    let numericRegex = /[^0-9.]/g;

    switch (e.target.name) {
      case "price":
        if (e.target.value) {
          setPriceType("fixed");
          setMinPrice("");
          setMaxPrice("");
        } else {
          if (minPrice != "" || maxPrice != "") {
            setPriceType("flexible");
          } else {
            setPriceType("");
          }
        }
        e.target.value = e.target.value.replace(numericRegex, "");
        setPrice(e.target.value);
        break;
      case "minPrice":
        if (e.target.value) {
          setPrice("");
          setPriceType("flexible");
        } else {
          if (maxPrice != "") {
            setPriceType("flexible");
          } else {
            if (price != "") {
              setPriceType("fixed");
            } else {
              setPriceType("");
            }
          }
        }
        e.target.value = e.target.value.replace(numericRegex, "");
        setMinPrice(e.target.value);
        break;
      case "maxPrice":
        if (e.target.value) {
          setPrice("");
          setPriceType("flexible");
        } else {
          if (minPrice != "") {
            setPriceType("flexible");
          } else {
            if (price != "") {
              setPriceType("fixed");
            } else {
              setPriceType("");
            }
          }
        }
        e.target.value = e.target.value.replace(numericRegex, "");
        setMaxPrice(e.target.value);
        break;
      case "category":
        setCategory(e.target.value);
        break;
      case "object":
        setObject(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "processTime":
        setProcessTime(e.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.show) {
      setEscrowType(escrows?.escrow_type ? escrows?.escrow_type : "");
      setPrice(escrows?.fixed_price ? escrows?.fixed_price : "");
      setPriceType("fixed");
      setMinPrice(escrows?.flex_min_price ? escrows?.flex_min_price : "");
      setMaxPrice(escrows?.flex_max_price ? escrows?.flex_max_price : "");
      setCategory(escrows?.category ? escrows?.category : "high_value_items");
      setObject(escrows?.object ? escrows?.object : "jwellery");
      setDescription(escrows?.description ? escrows?.description : "");
      setProcessTime(
        escrows?.time_constraints ? escrows?.time_constraints : "24 Hours"
      );
    }
  }, [props.show]);

  function copyToClipboard(e) {
    escrowLinkRef.current.select();
    document.execCommand("copy");
  }

  const submitHandler = async () => {
    if (step === 3 && !description) {
      dispatch(notificationFail("Please add Description"));
      return false;
    }
    const reqData = {
      escrowType,
      priceType,
      price,
      minPrice,
      maxPrice,
      category,
      object,
      description,
      processTime,
    };
    await jwtAxios
      .put(`/escrows/editEscrow/${props.id}`, reqData)
      .then((escrowResult) => {
        if (escrowResult?.data?.data?.escrow_number) {
          setEscrowNumber(escrowResult?.data?.data?.escrow_number);
          dispatch(notificationSuccess(escrowResult?.data?.message));
          setStep(step + 1);
        } else {
          dispatch(notificationFail("Something went wrong"));
        }
      })
      .catch((error) => {
        if (typeof error == "string") {
          dispatch(notificationFail(error));
        }
        if (error?.response?.data?.message === "") {
          dispatch(notificationFail("Invalid "));
        }
        if (error?.response?.data?.message) {
          dispatch(notificationFail(error?.response?.data?.message));
        }
      });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
  };

  const homeBtnHandler = async () => {
    props.onHide();
    navigate("/");
  };

  useEffect(() => {
    jwtAxios
      .get(`/escrows/getEscrowsById/${props.id}`)
      .then((res) => {
        setEscrow(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [acAddress.authToken]);

  const handleSelectedClick = (value) => {
    setCategory(value);
    setShowOptions(false);
  };

  const handleProcessTimeClick = (value) => {
    setProcessTime(value);
    setShowProcessTime(false);
  };

  const handleSelectedObjectClick = (value) => {
    setObject(value);
    setShowObject(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setShowObject(false);
    setShowProcessTime(false);
  };
  const toggleObjectOptions = () => {
    setShowObject(!showObjects);
    setShowProcessTime(false);
    setShowOptions(false);
  };

  const toggleProcessOptions = () => {
    setShowProcessTime(!showProcessTime);
    setShowObject(false);
    setShowOptions(false);
  };

  return (
    <Modal
      {...props}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Form onSubmit={formSubmitHandler}>
        {step === 1 && escrows && (
          <>
            <Modal.Header>
              <Modal.Title>
                Im {escrowType == "buyer" ? "Buyer" : "Seller"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <p className="mb-4">
                Define how customers open your offers, choose fixed if you have
                a specific price or let them choose with flexible.
              </p>
              <h5 className="mb-4">Fixed</h5>
              <Row>
                <Col md="6">
                  <Form.Group className="form-group within-focus">
                    <Form.Label>Price</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        name="price"
                        placeholder="1"
                        onChange={inputChangeHandler}
                        value={price}
                      />
                      <div className="currency-type">
                        <span className="currency-flag"></span>USD
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <h5 className="mt-2 mb-4">Flexible</h5>
              <Row className="gx-3">
                <Col md="6">
                  <Form.Group className="form-group within-focus">
                    <Form.Label>min</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="5"
                        name="minPrice"
                        onChange={inputChangeHandler}
                        value={minPrice}
                      />
                      <div className="currency-type">
                        <span className="currency-flag"></span>USD
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group within-focus">
                    <Form.Label>max</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="100"
                        name="maxPrice"
                        onChange={inputChangeHandler}
                        value={maxPrice}
                      />
                      <div className="currency-type">
                        <span className="currency-flag"></span>USD
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Text>Example: 5 USD - 100 USD</Form.Text>
              <div className="form-action-group">
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
                <Button variant="secondary" onClick={props.onHide}>
                  Cancel
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
        {step === 2 && (
          <>
            <Modal.Header>
              <Modal.Title>Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              <p className="mb-4">
                Tell us what you are selling and the description that best
                characterizes the nature of that sale and provide the time you
                will take to provide it.
              </p>
              <Row className="gx-3">
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Category</Form.Label>
                    <div className="customSelectBox" ref={countryDropdownRef}>
                      <div
                        className="form-select"
                        onClick={toggleOptions}
                        aria-label="High-value items"
                      >
                        {categories.find((cat) => cat.value === category)
                          ?.label || category}
                      </div>
                      {showOptions && (
                        <ul className="options">
                          {categories.map((category) => (
                            <li
                              key={category.value}
                              onClick={() =>
                                handleSelectedClick(category.value)
                              }
                            >
                              {category.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Object</Form.Label>
                    <div className="customSelectBox" ref={optionsDropdownRef}>
                      <div
                        className="form-select"
                        onClick={toggleObjectOptions}
                        aria-label="Jewlery"
                      >
                        {objects.find((cat) => cat.value === object)?.label ||
                          object}
                      </div>
                      {showObjects && (
                        <ul className="options">
                          {objects.map((obj) => (
                            <li
                              key={obj.value}
                              onClick={() =>
                                handleSelectedObjectClick(obj.value)
                              }
                            >
                              {obj.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="form-group mt-2">
                <Form.Label>Description of Transaction</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  onChange={inputChangeHandler}
                  placeholder="Description of Transaction"
                  value={description}
                />
              </Form.Group>
              <h5 className="my-4">Time constraints</h5>
              <Form.Group className="form-group">
                <Form.Label>Process time</Form.Label>
                <div className="customSelectBox" ref={locationDropdownRef}>
                  <div
                    className="form-select"
                    onClick={toggleProcessOptions}
                    aria-label="24 Hours"
                  >
                    {processTimes.find((cat) => cat.value === processTime)
                      ?.label || processTime}
                  </div>
                  {showProcessTime && (
                    <ul className="options">
                      {processTimes.map((processTime) => (
                        <li
                          key={processTime.value}
                          onClick={() =>
                            handleProcessTimeClick(processTime.value)
                          }
                        >
                          {processTime.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Form.Group>
              <div className="form-action-group">
                <Button variant="primary" onClick={submitHandler}>
                  Update
                </Button>
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
        {step === 3 && (
          <>
            <Modal.Header>
              <Modal.Title>Escrow has been Updated</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              <p className="mb-4">
                Your secure link has been Updated, share it with your buyer to
                start trading with the decentralized escrow.
              </p>
              <Form.Group className="form-group">
                <Form.Label>Your Escrow Link</Form.Label>
                <Form.Control
                  ref={escrowLinkRef}
                  type="text"
                  value={`app.middn.com/join-transaction/${escrowNumber}`}
                  readOnly
                />
              </Form.Group>
              <div className="form-action-group">
                <Button variant="primary" onClick={copyToClipboard}>
                  Copy link
                </Button>
                <Button variant="secondary" onClick={homeBtnHandler}>
                  Back home
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditEscrowView;
