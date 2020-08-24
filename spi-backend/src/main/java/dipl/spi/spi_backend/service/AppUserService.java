package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AppUserService {

    @Autowired
    private AppUserRepository userRepository;


    public AppUser findUserById(Long id) {
        Optional<AppUser> appUser = userRepository.findById(id);
        if(appUser.isPresent()) {
            return appUser.get();
        }
        throw new ApiNotFoundException("Failed to find user with id " + id);
    }

}
