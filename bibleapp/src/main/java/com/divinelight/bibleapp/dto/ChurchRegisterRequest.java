package com.divinelight.bibleapp.dto;

public class ChurchRegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String churchName;
    private String churchLocation;
    private String churchAddress;
    private String churchPhone;
    private String churchEmail;
    private String churchTiming;
    private String churchAbout;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getChurchName() { return churchName; }
    public void setChurchName(String churchName) { this.churchName = churchName; }
    public String getChurchLocation() { return churchLocation; }
    public void setChurchLocation(String churchLocation) { this.churchLocation = churchLocation; }
    public String getChurchAddress() { return churchAddress; }
    public void setChurchAddress(String churchAddress) { this.churchAddress = churchAddress; }
    public String getChurchPhone() { return churchPhone; }
    public void setChurchPhone(String churchPhone) { this.churchPhone = churchPhone; }
    public String getChurchEmail() { return churchEmail; }
    public void setChurchEmail(String churchEmail) { this.churchEmail = churchEmail; }
    public String getChurchTiming() { return churchTiming; }
    public void setChurchTiming(String churchTiming) { this.churchTiming = churchTiming; }
    public String getChurchAbout() { return churchAbout; }
    public void setChurchAbout(String churchAbout) { this.churchAbout = churchAbout; }
}
