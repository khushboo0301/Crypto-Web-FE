import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";
import { IoIosCloseCircle } from "react-icons/io";
import { LinkSimpleIcon, SmileyIcon } from "../../component/SVGIcon";
import { userDetails } from "../../store/slices/AuthSlice";
import MessageList from "../chat/MessageList";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CardContent, Radio } from "@mui/material";
import Modal from "@mui/material/Modal";
import CopyImage from "../../content/images/copyimage.svg";
import PaymentReceivedPopup from "./PaymentReceivedPopup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 586,
  bgcolor: " #18191D",
  padding: "20px",
  borderRadius: "16px",
  color: "white",
};

const steps = [
  {
    label: "Confirm order info",
    description: (
      <Box className="confirm-order-info">
        <Box className="single-confirm-order">
          <p>Fiat Amount</p>
          <span className="gradiant-color">£ 1620</span>
        </Box>
        <Box className="single-confirm-order">
          <p>Price </p>
          <span>£ 1620,21</span>
        </Box>
        <Box className="single-confirm-order">
          <p>Quantity </p>
          <span>0,00012312 ETH</span>
        </Box>
      </Box>
    ),
  },
  {
    label: "Confirm payment",
    description: (
      <>
        <p
          style={{
            fontFamily: "eudoxus sans",
            fontSize: "13px",
            fontWeight: "700",
            lineHeight: "18px",
            color: "#808191",
            marginBottom: "12px",
          }}
        >
          Login to your payment account below, confirm you have received the
          payment
        </p>
        <Card
          style={{
            background: "#212121",
            border: "1px solid #3F3F3F",
            borderRadius: "11px",
          }}
        >
          <CardContent
            style={{
              padding: "16px",
              display: "flex",
              gap: "54px",
            }}
          >
            <Box>
              <Button
                style={{
                  background: "#373A43",
                  color: "#fff",
                  fontWeight: "unset",
                  fontFamily: "eudoxus sans",
                }}
              >
                Bank Information
              </Button>
            </Box>
            <Box className="make-payment-stepper">
              <div>
                <p>Name</p>
                <h5 style={{ display: "flex" }}>
                  Joseph Nolan
                  {/* <img src={CopyImage} alt="CopyImage" /> */}
                </h5>
              </div>
              <div>
                <p>Bank Card Number</p>
                <h5 style={{ display: "flex" }}>
                  92637123
                  {/* <img src={CopyImage} alt="CopyImage" /> */}
                </h5>
              </div>
              <div>
                <p>Bank name</p>
                <h5 style={{ display: "flex" }}>
                  Bank name
                  {/* <img src={CopyImage} alt="CopyImage" /> */}
                </h5>
              </div>
              {/* <div>
              <p>Account Opening Branch</p>
              <h5 style={{ display: "flex" }}>
                254
                <img src={CopyImage} alt="CopyImage" />
              </h5>
            </div> */}
            </Box>
          </CardContent>
        </Card>
      </>
    ),
  },
  {
    label: "Notify Seller",
    description: (
      <p
        style={{
          fontFamily: "eudoxus sans",
          fontSize: "13px",
          fontWeight: "700",
          lineHeight: "18px",
          color: "#808191",
          marginBottom: "32px",
        }}
      >
        After payment, remember to click the ‘Transferred, Notify Seller’ button
        facilitate the crypto release by the seller
      </p>
    ),
  },
];

export const MarketPlaceDeposit = (props) => {
  const [open, setOpen] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const { id } = props;
  const dispatch = useDispatch();
  const [showSmily, setShowSmily] = useState(false);
  const acAddress = useSelector(userDetails);
  const emojiPickerRef = useRef(null);
  const [escrow, setEscrow] = useState(null);
  const [selectedValue, setSelectedValue] = React.useState("a");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const receiverAddress =
    acAddress?.account === escrow?.user_address
      ? escrow?.trade_address
      : escrow?.user_address;

  const userRef = useRef(null);
  const fileInputRef = useRef(null);
  const { onClickOutside } = <Picker />;
  const [messageText, setMessageText] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [escrowLoading, setEscrowLoading] = useState(false);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNextStepper = () => {
    if (activeStep === steps.length - 1) {
      handleReset(); // Reset to the initial  step
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleBack = () => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatEscrowPage({ user: null, isChatOpen: true }));
  };

  useEffect(() => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatEscrowPage({ user: null, isChatOpen: true }));
  }, []);

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowSmily(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  const handleDeselctImage = () => {
    setMessageFile("");
  };

  return (
    <>
      <div className="market-place-buy-sell chat-messages">
        <Row>
          <Col lg="7">
            <Card className="cards-dark">
              <div
                style={{
                  fontFamily: "eudoxus sans",
                  fontSize: " 13px",
                  fontWeight: " 700",
                  lineHeight: "18px",
                  textAlign: "left",
                  padding: "12px 24px",
                  color: "#fff",
                  background: "#1E1E21",
                  width: "100%",
                  borderRadius: "20px 20px 0px 0px",
                  display: "flex",
                  justifyContent: " space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span>Order number</span>
                  <span
                    style={{
                      color: "#808191",
                      padding: "0 8px",
                      display: "flex",
                    }}
                  >
                    20613122389277339648
                    <img src={CopyImage} alt="CopyImage" />
                  </span>
                </div>
                <div>
                  <span>Time created</span>
                  <span style={{ color: "#808191", padding: "0 8px" }}>
                    2024-04-15 16:36:12
                  </span>
                </div>
              </div>
              <Box
                sx={{
                  padding: "20px 24px",
                }}
              >
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  className="stepper-container"
                >
                  {steps.map((step, index) => (
                    <Step
                      key={step.label}
                      sx={{ color: "#fff", cursor: "pointer" }}
                    >
                      <StepLabel
                        onClick={handleNextStepper}
                        className="step-label"
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography sx={{ color: "#fff" }}>
                          {step.description}
                        </Typography>

                        {index === steps.length - 1 && (
                          <>
                            <Button
                              variant="contained"
                              className="btn-primary"
                              onClick={handleOpen}
                              style={{
                                padding: "16px 21px",
                                marginRight: "10px",
                                width: "208px",
                              }}
                            >
                              Payment received
                            </Button>
                            <Button
                              variant="contained"
                              className="btn-primary"
                              style={{
                                padding: "16px 21px",
                                background: "#373A43",
                                color: "#fff",
                                width: "208px",
                              }}
                            >
                              Help
                            </Button>
                          </>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper
                    square
                    elevation={0}
                    sx={{
                      p: 3,
                      background: "transparent",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <Typography>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Transferred, notify seller
                    </Button>
                    <Button sx={{ mt: 1, mr: 1 }}>Cancel</Button>
                  </Paper>
                )}
              </Box>
            </Card>
          </Col>
          <Col lg="5">
            <Card className="cards-dark chat-box">
              <Card.Body>
                <div className="d-flex items-center justify-content-between pe-4 mb-3">
                  <Card.Title
                    as="h2"
                    style={{ marginBottom: 0, fontWeight: "700" }}
                  >
                    Chatbox
                  </Card.Title>
                  <div
                    style={{ display: "flex", gap: "10px", fontSize: "13px" }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        fontFamily: "eudoxus sans",
                      }}
                    >
                      Trades History
                    </span>
                    <span
                      style={{
                        color: " #FF754C",
                        fontFamily: "eudoxus sans",
                        fontWeight: "600",
                      }}
                    >
                      Report
                    </span>
                  </div>
                </div>
                <div className="chat-box-list">
                  <div
                    style={{
                      fontFamily: "eudoxus sans",
                      fontSize: " 13px",
                      fontWeight: " 700",
                      lineHeight: "18px",
                      textAlign: "left",
                      padding: "12px 24px",
                      color: "#fff",
                      background: "#1E1E21",
                      position: "absolute",
                      top: " 0",
                      left: "0",
                      width: "100%",
                      borderRadius: "20px 20px 0px 0px",
                    }}
                  >
                    <span>Moderator</span>
                    <span style={{ color: "#808191", padding: "0 8px" }}>
                      Unavailable
                    </span>
                    <span
                      className="dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        background: " #EC6060",
                        borderRadius: " 50%",
                        display: "inline-block",
                      }}
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      background: "#252527",
                      position: "absolute",
                      top: " 40px",
                      left: "0",
                      color: "#fff",
                      padding: "8px 24px",
                      width: "100%",
                    }}
                  >
                    Order Created
                    <span
                      style={{
                        background: "#FFC2462E",
                        color: "#FFC246",
                        fontSize: "13px",
                        fontFamily: "eudoxus sans",
                        fontWeight: "600",
                        padding: " 4px 6px",
                        borderRadius: "6px",
                        marginLeft: "12px",
                      }}
                    >
                      04: 30 Left to pay
                    </span>
                  </div>
                  <ul>
                    {escrowLoading && (
                      <MessageList
                        ReciverId={receiverAddress}
                        EscrowPay={"escrow-offer"}
                        escrowId={id}
                      />
                    )}
                  </ul>
                  {showSmily && (
                    <div userRef={emojiPickerRef} className="emoji-picker">
                      <Picker
                        autoFocusSearch={true}
                        className="emoji-popup"
                        theme="dark"
                        lazyLoadEmojis={true}
                      />
                    </div>
                  )}

                  <div
                    className="chat-action"
                    style={{ visibility: "visible" }}
                  >
                    {messageFile && (
                      <div className="attach">
                        <div className="flex items-center justify-between px-2 py-1  border rounded-full shadow-md fileClass">
                          <div className="flex items-center space-x-2">
                            {RenderIcon(messageFile.name)}
                            <span className=" truncate">
                              {messageFile.name}
                            </span>
                            <IoIosCloseCircle
                              style={{ fontSize: "25px", marginLeft: "14px" }}
                              onClick={handleDeselctImage}
                            />
                            <div className="file-size">
                              {messageFile?.size &&
                                formateSize(messageFile?.size)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="messsge">
                      <div className="button-container">
                        <Button variant="link">
                          <SmileyIcon width="20" height="20" />
                        </Button>
                        <Button
                          variant="link"
                          className="ms-3">
                          <LinkSimpleIcon width="20" height="20" />
                        </Button>
                      </div>

                      <Form className="input-container">
                        <input
                          userRef={fileInputRef}
                          type="file"
                          style={{ display: "none" }}
                        />

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Send a message…"
                          name="content"
                          value={messageText}
                          autoComplete="off"
                        />

                        <Button variant="primary" type="submit" size="sm">
                          <span className="chat-send-btn">Send</span>
                          <img
                            className="chat-send-btn-icon"
                            src={require("../../content/images/Frame.png")}
                          />
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <PaymentReceivedPopup show={showModal} onHide={handleClose} />
      </div>
    </>
  );
};

export default MarketPlaceDeposit;
