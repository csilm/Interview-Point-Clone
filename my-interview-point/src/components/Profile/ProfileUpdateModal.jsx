// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
import { useFormik } from "formik";
import shallow from "zustand/shallow";
import { userProfileUpdateValidation } from "../../validators/profileValidations";
import useProfileStore from "../../store/useProfileStore";
// import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { usePatchRequest } from "../../hooks/requestMethods";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useRef } from "react";

export const ProfileImage = () => {
  // glabal storage
  const [userProfile, setUserProfile] = useProfileStore(
    (state) => [state.userProfile, state.setUserProfile],
    shallow
  );
  const { user } = useAuthContext();
  const { data: getUpdateData, updateData } = usePatchRequest();

  const fileInput = useRef(null);
  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = {
        profile_image: reader.result.toString(),
      };
      updateData("/api/user/profile/", user.token, data);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (getUpdateData) {
      setUserProfile(getUpdateData);
    }
  }, [getUpdateData, setUserProfile]);
  return (
    <>
      <label
        htmlFor="dropzone-file"
        className="cursor-pointer"
        onClick={(e) => fileInput.current && fileInput.current.click()}
      >
        <img
          src={
            userProfile?.profile_image
              ? userProfile?.profile_image
              : "https://www.w3schools.com/w3images/avatar2.png"
          }
          alt=""
          className="inline-block m-auto w-32 h-32 rounded-full md:w-48 md:h-48 md:rounded-full"
        />
        <input
          id="dropzone-file"
          className="hidden"
          accept="image/*"
          multiple
          type="file"
          onChange={handleChange}
        />
      </label>
    </>
  );
};

// main component
const ProfileUpdateModal = ({ open, setOpen }) => {
  // glabal storage
  const [userProfile, setUserProfile] = useProfileStore(
    (state) => [state.userProfile, state.setUserProfile],
    shallow
  );
  const { user } = useAuthContext();
  const { data: getUpdateData, updateData } = usePatchRequest();

  /** form submision */
  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
    handleSubmit,
    // setFieldValue,
    // resetForm,
  } = useFormik({
    initialValues: {
      name: userProfile.name ?? "",
      email: userProfile.email ?? "",
      mobile_number: userProfile.mobile_number ?? "",
      about: userProfile.about ?? "",
    },
    validationSchema: userProfileUpdateValidation,
    onSubmit: async (data, action) => {
      try {
        updateData("/api/user/profile/", user.token, data);
        setOpen(!open);
      } catch (error) { }
    },
  });
  useEffect(() => {
    if (getUpdateData) {
      setUserProfile(getUpdateData);
    }
  }, [getUpdateData, setUserProfile]);

  return (
    <div>
      <div>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          onClose={() => setOpen(!open)}
        >
          <DialogTitle>{"UpdateProfile"}</DialogTitle>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <DialogContent>
              <div className="my-2">
                <TextField
                  fullWidth
                  required
                  placeholder="Mr Jine"
                  size="small"
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </div>
              <div className="my-2">
                <TextField
                  fullWidth
                  required
                  placeholder="email@email.com"
                  size="small"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </div>

              <div className="my-2">
                <TextField
                  fullWidth
                  required
                  placeholder="01515620108"
                  size="small"
                  label="Mobile"
                  name="mobile_number"
                  value={values.mobile_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.mobile_number && Boolean(errors.mobile_number)}
                  helperText={touched.mobile_number && errors.mobile_number}
                />
              </div>

              {/* <div className="my-2">
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  placeholder="About"
                  size="small"
                  label="About"
                  name="about"
                  value={values.about}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.about && Boolean(errors.about)}
                  helperText={touched.about && errors.about}
                />
              </div> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(!open)}>Disagree</Button>
              <Button
                // fullWidth
                variant="outlined"
                type="submit"
                loading={isSubmitting}
                loadingPosition="start"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
