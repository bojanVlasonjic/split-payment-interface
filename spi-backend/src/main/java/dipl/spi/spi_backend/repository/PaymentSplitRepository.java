package dipl.spi.spi_backend.repository;

import dipl.spi.spi_backend.model.PaymentSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentSplitRepository extends JpaRepository<PaymentSplit, Long> {
}
