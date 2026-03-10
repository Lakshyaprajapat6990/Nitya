import { Box, Button, Typography, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomTextField, GlobalCssStyles } from "../../style/GlobalCSS";
import { FieldArray, Form, Formik } from "formik";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AsyncSelect from "react-select/async";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import * as Yup from "yup";
import { CreatePoojaAPI } from "../../services/CreatePoojaAPI";
import UploadIcon from "../../assests/upload-icon.svg";
import CloseIcon from "@mui/icons-material/Close";
import { CreateTempleAPI } from "../../services/CreateTempleAPI";
import { CreateChadhavaAPI } from "../../services/CreateChadhavaAPI";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import AsyncCreatableSelect from "react-select/async-creatable";
import { UploadItemImg } from "../../services/UploadItemImg";
import { CreatePoojaFile } from "../../services/CreatePoojaFile";
import { useNavigate } from "react-router-dom";

const MAX_LOGOS = 5;

const initialValues = {
  title: "",
  titleHi: "",
  subtitle: "",
  subtitleHi: "",
  description: "",
  descriptionHi: "",
  mandir: null,
  mandirHi: null,
  chadhava: null,
  startDate: null,
  file: null,
  fileHi: null,
  logoImages: Array(MAX_LOGOS).fill(null),
  logoImagesHi: Array(MAX_LOGOS).fill(null),
  newLogoImages: [],
  newLogoImagesHi: [],
  removedLogoImageIds: [],
  removedLogoImageIdsHi: [],
  cItem: [
    {
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
      price: "",
      imageUrl: null,
    },
  ],
  benefit: [
    {
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
    },
  ],
  faq: [{ question: "", questionHi: "", answer: "", answerHi: "" }],
};

export default function AddChadhava({ open, handleClose }) {
  const [poojaData, setPoojaData] = useState(initialValues);
  const navigate = useNavigate();
  const [templeData, setTempleData] = useState([]);
  const [mandirOptions, setMandirOptions] = useState([]);
  const [templeList, setTempleList] = useState([]);
  const [templeListHi, setTempleListHi] = useState([]);

  const getTemple = async () => {
    const res = await GetAllTempleAPI();
    const english = (res || []).map((item) => ({
      value: item?.title || "",
      label: item?.title || "",
    }));
    const hindi = (res || []).map((item) => ({
      value: item?.titleHi || item?.title || "",
      label: item?.titleHi || "",
    }));
    setTempleList(english);
    setTempleListHi(hindi);
  };

  useEffect(() => {
    getTemple();
  }, []);

  const locationOptionsHi = [...templeListHi];
  const locationOptions = [...templeList];

  const loadLocationOptions = (inputValue, callback) => {
    const filtered = locationOptions.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  const loadLocationOptionsHi = (inputValue, callback) => {
    const filtered = locationOptionsHi.filter((opt) =>
      opt.label.includes(inputValue)
    );
    callback(filtered);
  };

  const handleLogoImageUploadAtIndex = (
    event,
    values,
    setFieldValue,
    index,
    fieldName,
    newFieldName
  ) => {
    const file = event.target.files[0] || null;
    const updated = [...values[fieldName]];
    updated[index] = file;
    setFieldValue(fieldName, updated);

    if (file) {
      setFieldValue(newFieldName, [...(values[newFieldName] || []), file]);
    }
  };

  const removeLogoImageAtIndex = (
    index,
    values,
    setFieldValue,
    fieldName,
    newFieldName,
    removedIdsField
  ) => {
    const updated = [...values[fieldName]];
    const removedFile = updated[index];

    if (removedFile && removedFile._id) {
      setFieldValue(removedIdsField, [
        ...(values[removedIdsField] || []),
        removedFile._id,
      ]);
    } else {
      setFieldValue(
        newFieldName,
        (values[newFieldName] || []).filter((file) => file !== removedFile)
      );
    }
  };

  const handleSubmit = async (val) => {
    const response = await CreateChadhavaAPI(val);
    if (response?._id) {
      const res = await CreatePoojaFile(response?._id, val, "chadhava");
      alert("Chadhava created successfully");
      if (res?.data?.status) {
        navigate("/chadhava");
      }
    } else if (response?.error) {
      alert(`Error: ${response?.error}`);
    }
  };

  return (
    <GlobalCssStyles>
      <Box style={{ width: "90%", margin: "auto", marginTop: "2%" }}>
        <Formik
          initialValues={poojaData}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          enableReinitialize={true}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            handleChange,
            isValid,
            dirty,
            setFieldTouched,
          }) => (
            <Form
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
            >
              <Box style={{ width: "90%", margin: "auto" }}>
                <Typography className="policies-text" sx={{ mb: 2 }}>
                  Add New Chadhava
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Box sx={{ width: "80%" }}>
                    {/* Title */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Title <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="title"
                          name="title"
                          value={values.title}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Chadhava (English)"
                          fullWidth
                          size="small"
                          error={touched.title && Boolean(errors.title)}
                          helperText={touched.title && errors.title}
                        />
                        <CustomTextField
                          id="titleHi"
                          name="titleHi"
                          value={values.titleHi}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="चढावा का नाम (हिंदी)"
                          fullWidth
                          size="small"
                          error={touched.titleHi && Boolean(errors.titleHi)}
                          helperText={touched.titleHi && errors.titleHi}
                        />
                      </Stack>
                    </Grid>

                    {/* Sub Title */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Sub Title <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="subtitle"
                          name="subtitle"
                          value={values.subtitle}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter sub-Title (English)"
                          fullWidth
                          size="small"
                          error={touched.subtitle && Boolean(errors.subtitle)}
                          helperText={touched.subtitle && errors.subtitle}
                        />
                        <CustomTextField
                          id="subtitleHi"
                          name="subtitleHi"
                          value={values.subtitleHi}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="उपशीर्षक दर्ज करें (हिंदी)"
                          fullWidth
                          size="small"
                          error={touched.subtitleHi && Boolean(errors.subtitleHi)}
                          helperText={touched.subtitleHi && errors.subtitleHi}
                        />
                      </Stack>
                    </Grid>

                    {/* Chadhava Value */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Chadhava Value <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="chadhava"
                          name="chadhava"
                          value={values.chadhava}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter chadhava value"
                          fullWidth
                          size="small"
                          error={touched.chadhava && Boolean(errors.chadhava)}
                          helperText={touched.chadhava && errors.chadhava}
                        />
                      </Stack>
                    </Grid>

                    {/* Mandir (English) */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Mandir <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="mandir"
                        name="mandir"
                        cacheOptions
                        defaultOptions={templeList}
                        options={templeList}
                        value={values.mandir}
                        onChange={(option) => setFieldValue("mandir", option)}
                        isClearable
                        placeholder="Select Mandir"
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        onBlur={() => setFieldTouched("mandir", true)}
                      />
                      {touched.mandir && errors.mandir && (
                        <Typography color="error" variant="caption" className="error-msg">
                          {errors.mandir}
                        </Typography>
                      )}
                    </Grid>

                    {/* Mandir (Hindi) */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        मंदिर चुने <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="mandirHi"
                        name="mandirHi"
                        cacheOptions
                        defaultOptions={templeListHi}
                        options={templeListHi}
                        value={values.mandirHi}
                        onChange={(option) => setFieldValue("mandirHi", option)}
                        isClearable
                        placeholder="Select Mandir"
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        onBlur={() => setFieldTouched("mandirHi", true)}
                      />
                      {touched.mandirHi && errors.mandirHi && (
                        <Typography color="error" variant="caption" className="error-msg">
                          {errors.mandirHi}
                        </Typography>
                      )}
                    </Grid>

                    {/* Images (English) */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Add Image (English)
                      </Typography>
                      {[...Array(MAX_LOGOS)].map((_, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            gap: "0.7rem",
                          }}
                        >
                          <input
                            type="file"
                            id={`logo-images-upload-${idx}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.currentTarget.files[0];
                              if (file) {
                                const uploadedUrl = await UploadItemImg(file);
                                if (uploadedUrl) {
                                  setFieldValue(
                                    `logoImages.${idx}`,
                                    uploadedUrl?.data?.images
                                  );
                                }
                              }
                            }}
                          />
                          {values.logoImages[idx]?.url ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                gap: 1,
                              }}
                            >
                              <img
                                src={values.logoImages[idx].url}
                                alt={`logo-${idx}`}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {values.logoImages[idx]?.name || "Uploaded Image"}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setFieldValue(`logoImages.${idx}`, null)
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              style={{
                                minHeight: "2.5rem",
                                borderRadius: 20,
                                background: "#fff",
                              }}
                              onClick={() =>
                                document.getElementById(`logo-images-upload-${idx}`).click()
                              }
                            >
                              <img
                                src={UploadIcon}
                                alt="Upload"
                                style={{ width: 20, marginRight: 8 }}
                              />
                              Upload Image {idx + 1}
                            </Button>
                          )}
                        </Box>
                      ))}
                    </Grid>

                    {/* Images (Hindi) */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        चित्र जोड़ें (हिंदी)
                      </Typography>
                      {[...Array(MAX_LOGOS)].map((_, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            gap: "0.7rem",
                          }}
                        >
                          <input
                            type="file"
                            id={`logo-images-upload-hi-${idx}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.currentTarget.files[0];
                              if (file) {
                                const uploadedUrl = await UploadItemImg(file);
                                if (uploadedUrl) {
                                  setFieldValue(
                                    `logoImagesHi.${idx}`,
                                    uploadedUrl?.data?.images
                                  );
                                }
                              }
                            }}
                          />
                          {values.logoImagesHi[idx]?.url ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                gap: 1,
                              }}
                            >
                              <img
                                src={values.logoImagesHi[idx].url}
                                alt={`logo-hi-${idx}`}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {values.logoImagesHi[idx]?.name || "Uploaded Image"}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setFieldValue(`logoImagesHi.${idx}`, null)
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              style={{
                                minHeight: "2.5rem",
                                borderRadius: 20,
                                background: "#fff",
                              }}
                              onClick={() =>
                                document.getElementById(`logo-images-upload-hi-${idx}`).click()
                              }
                            >
                              <img
                                src={UploadIcon}
                                alt="Upload"
                                style={{ width: 20, marginRight: 8 }}
                              />
                              चित्र अपलोड करें {idx + 1}
                            </Button>
                          )}
                        </Box>
                      ))}
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Description
                      </Typography>
                      <CustomTextField
                        as="textarea"
                        name="description"
                        sx={{ minWidth: "100%", minHeight: "10vh" }}
                        placeholder="Description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        size="small"
                      />
                      <CustomTextField
                        as="textarea"
                        name="descriptionHi"
                        sx={{ minWidth: "100%", minHeight: "10vh" }}
                        placeholder="डिस्क्रिप्शन जोड़े (हिंदी)"
                        value={values.descriptionHi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    {/* Items */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Items
                      </Typography>
                      <FieldArray name="cItem">
                        {({ push, remove }) => (
                          <Box>
                            {values.cItem.map((item, index) => (
                              <Box
                                key={index}
                                sx={{
                                  mb: 3,
                                  borderRadius: "8px",
                                }}
                              >
                                <Stack spacing={2}>
                                  <CustomTextField
                                    name={`cItem.${index}.title`}
                                    placeholder="Title (English)"
                                    value={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                  />
                                  <CustomTextField
                                    name={`cItem.${index}.titleHi`}
                                    placeholder="शीर्षक (हिंदी)"
                                    value={item.titleHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                  />
                                  <CustomTextField
                                    name={`cItem.${index}.description`}
                                    placeholder="Description (English)"
                                    value={item.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                  />
                                  <CustomTextField
                                    name={`cItem.${index}.descriptionHi`}
                                    placeholder="विवरण (हिंदी)"
                                    value={item.descriptionHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                  />
                                  <CustomTextField
                                    name={`cItem.${index}.price`}
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id={`cItem-image-${index}`}
                                      style={{ display: "none" }}
                                      onChange={async (e) => {
                                        const file = e.currentTarget.files[0];
                                        if (file) {
                                          const uploadedUrl = await UploadItemImg(file);
                                          if (uploadedUrl) {
                                            setFieldValue(
                                              `cItem.${index}.imageUrl`,
                                              uploadedUrl?.data?.images
                                            );
                                          }
                                        }
                                      }}
                                    />
                                    <label htmlFor={`cItem-image-${index}`}>
                                      <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={
                                          <img src={UploadIcon} alt="Upload" style={{ width: 20 }} />
                                        }
                                      >
                                        Upload Image
                                      </Button>
                                    </label>

                                    {item.imageUrl && (
                                      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                                        <img
                                          src={item.imageUrl?.url}
                                          alt={`Image Upload`}
                                          style={{ height: 50, borderRadius: 4 }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() => setFieldValue(`cItem.${index}.imageUrl`, null)}
                                          aria-label="remove image"
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    )}
                                  </Box>

                                  {values.cItem.length > 1 && (
                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                      <IconButton onClick={() => remove(index)} size="small" aria-label="delete">
                                        <DeleteOutlinedIcon color="error" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Stack>

                                {index === values.cItem.length - 1 && values.cItem.length < 5 && (
                                  <Box sx={{ mt: 2 }}>
                                    <Button
                                      onClick={() =>
                                        push({
                                          title: "",
                                          titleHi: "",
                                          description: "",
                                          descriptionHi: "",
                                          price: "",
                                          imageUrl: null,
                                        })
                                      }
                                      variant="outlined"
                                    >
                                      Add Items
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>

                    {/* Benefits */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Benefits
                      </Typography>
                      <FieldArray name="benefit">
                        {({ push, remove }) => (
                          <Box>
                            {values?.benefit?.map((item, index) => (
                              <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1, position: "relative" }}>
                                <Grid item xs={11} size={11}>
                                  <Stack spacing={2}>
                                    <CustomTextField
                                      name={`benefit.${index}.title`}
                                      placeholder="Add Title (English)"
                                      value={item.title}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                    />
                                    <CustomTextField
                                      name={`benefit.${index}.titleHi`}
                                      placeholder="शीर्षक जोड़ें (हिंदी)"
                                      value={item.titleHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`benefit.${index}.description`}
                                      placeholder="Description (English)"
                                      value={item.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`benefit.${index}.descriptionHi`}
                                      placeholder="विवरण (हिंदी)"
                                      value={item.descriptionHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    pt: 1,
                                  }}
                                >
                                  {values.benefit.length > 1 && (
                                    <IconButton onClick={() => remove(index)} size="small" aria-label="delete" sx={{ m: 0, p: 0 }}>
                                      <DeleteOutlinedIcon color="error" />
                                    </IconButton>
                                  )}
                                </Grid>
                                {index === values.benefit.length - 1 && values.benefit.length < 3 && (
                                  <Grid item xs={12} sx={{ pt: 1 }}>
                                    <Button
                                      onClick={() =>
                                        push({
                                          title: "",
                                          titleHi: "",
                                          description: "",
                                          descriptionHi: "",
                                        })
                                      }
                                      variant="text"
                                    >
                                      Add Benefit
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>

                    {/* FAQ */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        FAQ
                      </Typography>
                      <FieldArray name="faq">
                        {({ push, remove }) => (
                          <Box>
                            {values?.faq?.map((item, index) => (
                              <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1, position: "relative" }}>
                                <Grid item xs={11} size={11}>
                                  <Stack spacing={2}>
                                    <CustomTextField
                                      name={`faq.${index}.question`}
                                      placeholder="Question (English)"
                                      value={item.question}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                    />
                                    <CustomTextField
                                      name={`faq.${index}.questionHi`}
                                      placeholder="प्रश्न (हिंदी)"
                                      value={item.questionHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`faq.${index}.answer`}
                                      placeholder="Answer (English)"
                                      value={item.answer}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`faq.${index}.answerHi`}
                                      placeholder="उत्तर (हिंदी)"
                                      value={item.answerHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  size={1}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    pt: 1,
                                  }}
                                >
                                  {values.faq.length > 1 && (
                                    <IconButton onClick={() => remove(index)} size="small" aria-label="delete" sx={{ m: 0, p: 0 }}>
                                      <DeleteOutlinedIcon color="error" />
                                    </IconButton>
                                  )}
                                </Grid>
                                {index === values.faq.length - 1 && values.faq.length < 5 && (
                                  <Grid item xs={12} sx={{ pt: 1 }}>
                                    <Button
                                      onClick={() =>
                                        push({
                                          question: "",
                                          questionHi: "",
                                          answer: "",
                                          answerHi: "",
                                        })
                                      }
                                      variant="text"
                                    >
                                      Add FAQ
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>
                  </Box>

                  <Grid item xs={12} sm={6} size={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                      <Button className="create-btn" type="submit">
                        Create Chadhava
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </GlobalCssStyles>
  );
}

